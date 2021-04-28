import { OrderInput, Order, Orders, Portfolio, BotCandles, Balance } from '../lambda.types';
import candles from '../_common/utils/candles';
import symbols from '../_common/utils/symbols';
// @ts-ignore (needed for compile the bot worker)
const uuid = require('uuid/dist/v4').default;
export default class Trader {
	portfolio: Portfolio
	orders: Orders
	ordersToPlace: Order[]
	ordersToCancel: string[]
	prices: {[asset: string]: number}

	constructor( portfolio: Portfolio, orders: Orders, candles: BotCandles )  {
		this.portfolio = portfolio
		this.orders = orders
		this.ordersToPlace = [];
		this.ordersToCancel = [];
		this.prices = getPrices( candles );
	}

	getPortfolio() {
		return this.portfolio;
	}

	getBalance( asset: string ): Balance{
		let balance = this.portfolio[asset];
		return balance ?
			{...balance} :
			{ asset, total: 0, free: 0 }
		;
	}

	getOrder(id: string): Order | void {
		return this.orders[id];
	}

	placeOrder(orderInput: OrderInput): Order {
		let order: Order = {
			price: null,
			...orderInput,
			id: uuid(),
			status: 'pending',
			foreignId: null,
			errorReason: null,
			executedPrice: null,
			createdAt: Date.now(),
			placedAt: null,
			closedAt: null
		}

		this.ordersToPlace.push( order )
		return {...order};
	}

	cancelOrder( orderId: string ) {
		this.ordersToCancel.push( orderId );
	}

	getPortfolioValue(){
		let quotedAsset = symbols.getQuoted(Object.keys(this.prices)[0]);
		let quotedBalance = this.getBalance(quotedAsset);

		let total = quotedBalance.total;
		Object.keys( this.prices ).forEach( symbol => {
			let asset = symbols.getBase( symbol );
			let balance = this.getBalance(asset);
			if( asset === quotedAsset ){
				total += balance.total;
			}
			else {
				total += balance.total * this.prices[symbol];
			}
		})
		return total;
	}

	getPrice(symbol: string): number {
		return this.prices[symbol];
	}
}

function getPrices( symbolCandles: BotCandles ){
	let prices: { [asset: string]: number } = {};
	Object.keys( symbolCandles ).forEach( (symbol:string) => {
		prices[symbol] = candles.getClose( candles.getLast(symbolCandles[symbol]) )
	});
	return prices;
}