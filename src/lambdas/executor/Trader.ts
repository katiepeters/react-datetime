import { OrderInput, Order, Orders, Portfolio, BotCandles, Balance } from '../lambda.types';
import candles from '../_common/utils/candles';
import pairs from '../_common/utils/pairs';
import { v4 as uuid } from 'uuid';
import { DeploymentOrders } from '../model.types';
export default class Trader {
	portfolio: Portfolio
	orders: Orders
	ordersToPlace: Order[]
	ordersToCancel: string[]
	prices: {[asset: string]: number}
	openOrderIds: string[]

	constructor( portfolio: Portfolio, orders: DeploymentOrders, candles: BotCandles )  {
		this.portfolio = portfolio
		this.orders = orders.items
		this.ordersToPlace = [];
		this.ordersToCancel = [];
		this.openOrderIds = orders.openOrderIds;
		this.prices = getPrices( candles );
	}

	getPortfolio() {
		return this.portfolio;
	}

	getBalance( asset: string ): Balance {
		let balance = this.portfolio[asset];
		return balance ?
			{...balance} :
			{ asset, total: 0, free: 0 }
		;
	}

	getOrder(id: string): Order | void {
		return this.orders[id];
	}

	getOpenOrders() {
		return this.openOrderIds
			.map( id => ({ ...this.orders[id]}) )
			.concat( this.ordersToPlace.map( order => ({...order})) )
		;
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
			closedAt: null,
			marketPrice: this.prices[ orderInput.pair ]
		};

		this.ordersToPlace.push( order )
		this.orders = {
			...this.orders,
			[order.id]: order
		};
		return {...order};
	}

	cancelOrder( orderId: string ) {
		this.ordersToCancel.push( orderId );
	}

	getPortfolioValue(){
		let quotedAsset = pairs.getQuoted(Object.keys(this.prices)[0]);
		let quotedBalance = this.getBalance(quotedAsset);

		let total = quotedBalance.total;
		Object.keys( this.prices ).forEach( pair => {
			let asset = pairs.getBase( pair );
			let balance = this.getBalance(asset);
			if( asset === quotedAsset ){
				total += balance.total;
			}
			else {
				total += balance.total * this.prices[pair];
			}
		})
		return total;
	}

	getPrice(pair: string): number {
		return this.prices[pair];
	}
}

function getPrices( pairCandles: BotCandles ){
	let prices: { [asset: string]: number } = {};
	Object.keys( pairCandles ).forEach( (pair:string) => {
		prices[pair] = candles.getClose( candles.getLast(pairCandles[pair]) )
	});
	return prices;
}
