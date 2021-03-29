import { Portfolio, ArrayCandle, LimitOrderInput, MarketOrderInput, Order, OrderInput } from "../../../lambda.types";
import candles from "../../utils/candles";
import symbols from "../../utils/symbols";
import { CandleQuery, ExchangeAdapter, ExchangeCredentials, ExchangeOrder } from "../ExchangeAdapter";
import BitfinexAdapter from "./BitfinexAdapter";

export interface ExchangeAccountData {
	portfolio: Portfolio
	openOrders: Order[]
}

export default abstract class VirtualAdapter implements ExchangeAdapter {
	accountId: string
	exchangeAccountId: string
	orders: {[id: string]: ExchangeOrder}
	portfolio: Portfolio
	lastDate: number
	lastCandles: {[symbol: string]: ArrayCandle}

	constructor(credentials: ExchangeCredentials) {
		this.accountId = credentials.key
		this.exchangeAccountId = credentials.secret
	}

	async getCandles(options: CandleQuery): Promise<ArrayCandle[]> {
		if( !this.isDataInitialized() ){
			await this.initializeData();
		}

		let bfx = new BitfinexAdapter({ key: 'virtua', secret: 'virtua' });
		let candles = await bfx.getCandles(options);

		this.updateOpenOrders( options.market, candles[candles.length-1] );
		this.lastDate = options.lastCandleAt;

		return candles;
	}

	placeOrders(orders: OrderInput[]): Promise<ExchangeOrder[]> {
		let toReturn: ExchangeOrder[] = [];

		orders.forEach( order => {
			if( this.isEnoughFunds(order) ){
				toReturn.push( this.setPlacedOrder(order) )
			}
			else {
				toReturn.push( this.getNotEnoughFundsOrder(order) );
			}
		});

		return toReturn;
		
		orders.forEach( order => {
			toReturn.push({
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
			});
		});

		let toStore = toReturn.map( order => {
			if( order.type === 'limit' ){
				return {...order}
			}
			return this.resolveOrder(toStore)
		})
		throw new Error("Method not implemented.");
	}
	cancelOrders(orderIds: string[]): Promise<boolean[]> {
		throw new Error("Method not implemented.");
	}
	getOrders(ids: string[]): Promise<ExchangeOrder[]> {
		throw new Error("Method not implemented.");
	}
	getOpenOrders(): Promise<ExchangeOrder[]> {
		throw new Error("Method not implemented.");
	}
	getOrderHistory(): Promise<ExchangeOrder[]> {
		throw new Error("Method not implemented.");
	}

	isEnoughFunds( order: Order ){
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

	getNotEnoughFundsOrder( order: Order ): ExchangeOrder {
		return {
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
		}
	}

	setPlacedOrder( order: Order ): ExchangeOrder {
		const placedOrder: ExchangeOrder = {
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

		this.orders[ order.id ] = placedOrder;
		this.updateBalances( placedOrder );

		return {...placedOrder};
	}

	abstract getAccountData(accountId: string, exchangeAccountId: string): Promise<ExchangeAccountData>
	abstract updateAccountData(): Promise<void>
	abstract getSymbolData( symbol: string ): Promise<ArrayCandle[]>
	abstract getPortfolio(): Promise<Portfolio>
}


function isEnoughFunds( order: Order, portfolio: Portfolio, currentPrice: number ): boolean {
	if( order.direction === 'buy' ){
		let coin = symbols.getQuoted(order.symbol);
		let balance = portfolio[coin]?.free;
		if( !balance ) return false;

		if( order.type === 'market' ){
			return balance > order.amount * currentPrice;
		}
		else {
			// @ts-ignore
			return balance > order.amount * order.price;
		}
	}
	else {
		let coin = symbols.getBase(order.symbol);
		let balance = portfolio[coin]?.free;
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

function resolveOrder( order: ExchangeOrder, portfolio, )