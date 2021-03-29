import { Portfolio, ArrayCandle, Order, OrderInput, Balance } from "../../../lambda.types";
import ExchangeAccountModel from "../../dynamo/ExchangeAccountModel";
import candles from "../../utils/candles";
import symbols from "../../utils/symbols";
import { CandleQuery, ExchangeAdapter, ExchangeCredentials, ExchangeOrder, ExchangeVirtualData } from "../ExchangeAdapter";
import BitfinexAdapter from "./BitfinexAdapter";

export interface ExchangeAccountData {
	portfolio: Portfolio
	openOrders: Order[]
}

export default abstract class VirtualAdapter implements ExchangeAdapter {
	accountId: string
	exchangeAccountId: string
	orders: {[id: string]: ExchangeOrder}
	openOrders: string[]
	portfolio: Portfolio
	lastDate: number
	lastCandles: {[symbol: string]: ArrayCandle}

	constructor(credentials: ExchangeCredentials) {
		console.log('Key, portfolio', credentials.key);
		console.log('Secret, orders', credentials.secret);
		this.portfolio = JSON.parse(credentials.key).portfolio;
		this.orders = JSON.parse(credentials.secret).orders;
		this.openOrders = [];
		Object.values(this.orders).forEach( order => {
			if( order.status === 'pending' || order.status === 'placed' ){
				this.openOrders.push( order.id );
			}
		});
	}

	async getPortfolio(): Promise<Portfolio> {
		return this.portfolio;
	}

	async getCandles(options: CandleQuery): Promise<ArrayCandle[]> {
		let bfx = new BitfinexAdapter({ key: 'virtua', secret: 'virtua' });
		let data = await bfx.getCandles(options);

		this.lastCandles[options.market] = candles.getLast(data);
		this.lastDate = options.lastCandleAt;
		this.updateOpenOrders();
		return data;
	}

	async placeOrders(orders: OrderInput[]): Promise<ExchangeOrder[]> {
		return orders.map( this._placeOrder );
	}

	_placeOrder = (order: OrderInput): ExchangeOrder => {
		if( !this.hasEnoughFunds(order) ){
			let errorOrder: ExchangeOrder = {
				id: order.id,
				symbol: order.symbol,
				type: order.type,
				status: 'error',
				errorReason: 'not_enough_funds',
				direction: order.direction,
				amount: order.amount,
				price: order.price,
				executedPrice: null,
				placedAt: this.lastDate,
				closedAt: this.lastDate
			};

			this.orders[order.id] = errorOrder;
			return {...errorOrder};
		}
		let exchangeOrder: ExchangeOrder = {
			id: order.id,
			symbol: order.symbol,
			type: order.type,
			status: 'placed',
			errorReason: null,
			direction: order.direction,
			amount: order.amount,
			price: order.price,
			executedPrice: null,
			placedAt: this.lastDate,
			closedAt: null
		}
		this.updateBalance( exchangeOrder );
		this.orders[ order.id ] = exchangeOrder;
		this.openOrders.push( order.id );
		return {...exchangeOrder};
	}

	updateBalance( order: ExchangeOrder ) {
		let {baseBalance, quotedBalance} = this.getOrderBalances( order );

		const amount = order.amount;
		let value = order.price || 1;
		if( order.type === 'market' ){
			value = this.getLastPrice(order.symbol);
		}
		else if( order.status === 'completed' && order.executedPrice ){
			value = order.executedPrice;
		}

		if( order.direction === 'buy' ){
			if( order.status === 'placed' ){
				quotedBalance.free -= value;
			}
			else if( order.status === 'completed' ){
				quotedBalance.total -= value;
				baseBalance.total += amount;
				baseBalance.free += amount;
			}
			else if( order.status === 'cancelled' ){
				quotedBalance.free += value;
			}
		}
		else {
			if (order.status === 'placed') {
				baseBalance.free -= amount;
			}
			else if (order.status === 'completed') {
				baseBalance.total -= amount;
				quotedBalance.total += value;
				quotedBalance.free += value;
			}
			else if (order.status === 'cancelled') {
				baseBalance.free += amount;
			}
		}
	}

	getLastPrice( symbol:string ): number {
		return candles.getClose( this.lastCandles[symbol] );
	}

	getOrderBalances( order ){
		let baseAsset = symbols.getBase(order.symbol);
		let quotedAsset = symbols.getQuoted(order.symbol);

		return {
			baseBalance: this.getBalance( baseAsset ),
			quotedBalance: this.getBalance( quotedAsset )
		};
	}

	getBalance( asset: string ){
		let balance: Balance = this.portfolio[asset];
		if( balance ){
			return {...balance };
		}

		return {
			asset: asset,
			free: 0,
			total: 0 
		};
	}

	async cancelOrders(orderIds: string[]): Promise<boolean[]> {
		let results: boolean[] = [];
		orderIds.forEach( orderId => {
			let order: ExchangeOrder = this.orders[orderId];
			if( order?.status === 'pending' || order?.status === 'placed' ){
				this.cancelOrder( order );
				results.push(true);
			}
			else {
				results.push(false);
			}
		});

		return results;
	}
	cancelOrder( order: ExchangeOrder ){
		let updatedOrder: ExchangeOrder = {
			...order,
			status: 'cancelled',
			closedAt: this.lastDate
		};
		this.updateBalance(updatedOrder);
		this.orders[order.id] = order;
		
		// Remove the order from the open order list
		let i = this.openOrders.length;
		while(i-- > 0){
			if( this.openOrders[i] === order.id ){
				this.openOrders.splice(i, 1);
				return;
			}
		}
	}

	async getOrders(ids: string[]): Promise<ExchangeOrder[]> {
		return ids.map( id => ({...this.orders[id]}) );
	}
	async getOpenOrders(): Promise<ExchangeOrder[]> {
		return this.openOrders.map( id => ({ ...this.orders[id] }) );
	}

	async getOrderHistory(): Promise<ExchangeOrder[]> {
		let history: ExchangeOrder[] = [];
		let orders = Object.values(this.orders);
		let i = orders.length;
		while( i-- > 0 ){
			let status = orders[i].status;
			if( status === 'cancelled' || status === 'completed' ){
				history.push({ ...orders[i] });
			}
		}
		return history;
	}

	hasEnoughFunds( order: OrderInput ){
		if (order.direction === 'buy') {
			let coin = symbols.getQuoted(order.symbol);
			let balance = this.portfolio[coin]?.free;
			if (!balance) return false;

			if (order.type === 'market') {
				return balance > order.amount * this.getCurrentPrice(order.symbol);
			}
			else {
				// @ts-ignore
				return balance > order.amount * order.price;
			}
		}
		else {
			let coin = symbols.getBase(order.symbol);
			let balance = this.portfolio[coin]?.free;
			if (!balance) return false;

			if (order.type === 'market') {
				return balance > order.amount;
			}
			else {
				// @ts-ignore
				return balance > order.amount;
			}
		}
	}

	getCurrentPrice( symbol: string ): number{
		return candles.getClose( this.lastCandles[symbol] );
	}

	updateOpenOrders() {
		this.openOrders.forEach( orderId => {
			let order = this.openOrders[orderId];
			this.checkOrderCompleted( order );
		});
	}

	checkOrderCompleted( order: ExchangeOrder ) {
		let lastCandle = this.lastCandles[order.symbol];
		if( !lastCandle ) return;

		let updatedOrder: ExchangeOrder | undefined;
		if( order.type === 'market' ){
			updatedOrder = {
				...order,
				status: 'completed',
				price: candles.getClose(lastCandle),
				executedPrice: candles.getClose(lastCandle),
				closedAt: this.lastDate
			};
		}
		else if( order.direction === 'buy' && order.price ){
			if( candles.getLow(lastCandle) < order.price ){
				updatedOrder = {
					...order,
					status: 'completed',
					executedPrice: order.price,
					closedAt: this.lastDate
				};
			}
		}
		else if( order.direction === 'sell' && order.price ){
			if (candles.getHigh(lastCandle) > order.price) {
				updatedOrder = {
					...order,
					status: 'completed',
					executedPrice: order.price,
					closedAt: this.lastDate
				};
			} 
		}

		if( updatedOrder ){
			this.updateBalance( updatedOrder );
			this.orders[updatedOrder.id] = updatedOrder;
		}
	}

	getVirtualData(): ExchangeVirtualData{
		return {
			orders: JSON.stringify(this.orders),
			portfolio: JSON.stringify(this.portfolio)
		};
	}
}