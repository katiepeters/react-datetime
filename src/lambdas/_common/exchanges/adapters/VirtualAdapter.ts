import { Portfolio, ArrayCandle, Order, OrderInput, Balance } from "../../../lambda.types";
import { DbExchangeAccount } from "../../../model.types";
import ExchangeAccountModel from "../../dynamo/ExchangeAccountModel";
import candles from "../../utils/candles";
import symbols from "../../utils/symbols";
import { CandleQuery, ExchangeAdapter, ExchangeOrder, ExchangeVirtualData } from "../ExchangeAdapter";
import BitfinexAdapter from "./BitfinexAdapter";
import { v4 as uuid } from 'uuid';

export interface ExchangeAccountData {
	portfolio: Portfolio
	openOrders: Order[]
}

export default class VirtualAdapter implements ExchangeAdapter {
	exchangeAccount: DbExchangeAccount
	portfolio: Portfolio
	orders: {[id: string]: ExchangeOrder}
	openOrders: string[]
	lastDate: number
	placeDate: number
	lastCandles: {[symbol: string]: ArrayCandle}

	constructor(exchangeAccount: DbExchangeAccount) {
		console.log('Setting exchangeAccount', exchangeAccount);
		this.exchangeAccount = exchangeAccount;
		this.portfolio = {};
		this.orders = {};
		this.lastDate = -1;
		this.lastCandles = {};
		this.openOrders = [];
	}

	// This method is called by supplierdo
	// Backtracking set the portfolio and orders attributes directly
	async hydrate() {
		const { accountId, id: exchangeId } = this.exchangeAccount;
		console.log('Hydrating', this.exchangeAccount);
		let [portfolio, orders] = await Promise.all([
			ExchangeAccountModel.getVirtualPorftolio(accountId, exchangeId),
			ExchangeAccountModel.getVirtualOrders(accountId, exchangeId)
		]);

		this.portfolio = portfolio;
		this.orders = orders;
		this.openOrders = [];
		Object.values(this.orders).forEach(order => {
			if (order.status === 'pending' || order.status === 'placed') {
				this.openOrders.push(order.id);
			}
		});
	}

	async getPortfolio(): Promise<Portfolio> {
		return this.portfolio;
	}

	async getCandles(options: CandleQuery): Promise<ArrayCandle[]> {
		// Key and secret doesn't matter, candles are public
		let bfx = new BitfinexAdapter(this.exchangeAccount);
		let data = await bfx.getCandles(options);

		this.lastCandles[options.market] = candles.getLast(data);
		this.lastDate = options.lastCandleAt;
		this.updateOpenOrders();
		return data;
	}

	async placeOrders(orders: OrderInput[]): Promise<ExchangeOrder[]> {
		const placed = orders.map( this._placeOrder );
		return placed;
	}

	_placeOrder = (order: OrderInput): ExchangeOrder => {
		let date = this.placeDate;

		if( !this.hasEnoughFunds(order) ){
			let errorOrder: ExchangeOrder = {
				id: uuid(), // Simulate exchange orders having a different id
				symbol: order.symbol,
				type: order.type,
				status: 'error',
				errorReason: 'not_enough_funds',
				direction: order.direction,
				amount: order.amount,
				price: order.price,
				executedPrice: null,
				placedAt: date,
				closedAt: date
			};

			this.orders[errorOrder.id] = errorOrder;
			return {...errorOrder};
		}
		let exchangeOrder: ExchangeOrder = {
			id: uuid(), // Simulate exchange orders having a different id
			symbol: order.symbol,
			type: order.type,
			status: 'placed',
			errorReason: null,
			direction: order.direction,
			amount: order.amount,
			price: order.price,
			executedPrice: null,
			placedAt: date,
			closedAt: null
		}
		this.updateBalance( exchangeOrder );
		this.orders[exchangeOrder.id ] = exchangeOrder;
		this.openOrders.push(exchangeOrder.id );
		return {...exchangeOrder};
	}

	updateBalance( order: ExchangeOrder ) {
		let {baseBalance, quotedBalance} = this.getOrderBalances( order );

		const amount = order.amount;
		let price = order.price || 1;
		if( order.type === 'market' ){
			price = this.getLastPrice(order.symbol);
		}
		else if( order.status === 'completed' && order.executedPrice ){
			price = order.executedPrice;
		}

		const value = amount * price;
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

		// Update balances
		this.portfolio[symbols.getBase(order.symbol)] = baseBalance;
		this.portfolio[symbols.getQuoted(order.symbol)] = quotedBalance;
	}

	getLastPrice( symbol:string ): number {
		return candles.getClose( this.lastCandles[symbol] );
	}

	getOrderBalances( order ){
		const baseAsset = symbols.getBase(order.symbol);
		const quotedAsset = symbols.getQuoted(order.symbol);

		return {
			baseBalance: this.getBalance( baseAsset ),
			quotedBalance: this.getBalance( quotedAsset )
		};
	}

	getBalance( asset: string ){
		//console.log( 'Portfolio', this.portfolio);
		let balance: Balance = this.portfolio[asset];
		if( balance ){
			// console.log(`${asset} balance found`, balance);
			return {...balance };
		}

		//console.log(`${asset} balance NOT found`, balance);
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
		this.orders[order.id] = updatedOrder;
		
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
			let balance = this.getBalance(coin).free;
			
			if (order.type === 'market') {
				return balance >= order.amount * this.getCurrentPrice(order.symbol);
			}
			else {
				// @ts-ignore
				return balance >= order.amount * order.price;
			}
		}
		else {
			let coin = symbols.getBase(order.symbol);
			let balance = this.portfolio[coin]?.free;
			if (!balance) return false;

			if (order.type === 'market') {
				return balance >= order.amount;
			}
			else {
				// @ts-ignore
				return balance >= order.amount;
			}
		}
	}

	getCurrentPrice( symbol: string ): number{
		return candles.getClose( this.lastCandles[symbol] );
	}

	updateOpenOrders() {
		let i = this.openOrders.length;
		while( i-- > 0 ){
			let order = this.orders[this.openOrders[i]];
			if( this.checkOrderCompleted(order) ){
				this.openOrders.splice( i, 1 );
			}
		}
	}

	checkOrderCompleted( order: ExchangeOrder ): boolean {
		let lastCandle = this.lastCandles[order.symbol];
		if( !lastCandle ) return false;

		let updatedOrder: ExchangeOrder | undefined;
		if( order.type === 'market' ){
			updatedOrder = {
				...order,
				status: 'completed',
				price: candles.getClose(lastCandle),
				executedPrice: candles.getClose(lastCandle),
				closedAt: order.placedAt
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
			return true;
		}

		return false;
	}

	getVirtualData(): ExchangeVirtualData{
		return {
			orders: JSON.stringify(this.orders),
			portfolio: JSON.stringify(this.portfolio)
		};
	}

	getPlaceDate(asset: string) {
		// @ts-ignore
		let midCandle = (candles.getTime(this.lastCandles[asset][1]) - candles.getTime(this.lastCandles[asset][0])) / 2;
		return this.lastDate + midCandle;
	}
}