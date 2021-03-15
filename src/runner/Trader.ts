import { v4 as uuid } from 'uuid';

interface Balance {
	free: number,
	locked: number
}

interface Portfolio {
	[asset: string]: Balance
}

interface OrderInput {
	symbol: string
	type: 'limit' | 'market'
	direction: 'buy' | 'sell'
	amount: number
}

export interface Order extends OrderInput {
	id: string
	foreignId: string | null
	status: 'pending' | 'placed' | 'completed' | 'cancelled' | 'error'
	errorReason: string | null
	price: number | null
	executedPrice: number | null
	createdAt: number
	placedAt: number | null
	closedAt: number | null
}

interface LimitOrderInput extends OrderInput {
	type: 'limit'
	price: number
}

interface MarketOrderInput extends OrderInput {
	type: 'market'
}

export interface Orders {
	[orderId: string]: Order
}

export default class Trader {
	portfolio: Portfolio
	orders: Orders
	ordersToPlace: Order[]
	ordersToCancel: string[]

	constructor( portfolio: Portfolio, orders: Orders )  {
		this.portfolio = portfolio
		this.orders = orders
		this.ordersToPlace = [];
		this.ordersToCancel = [];
	}

	getPortfolio() {
		return this.portfolio
	}

	getOrder(id: string): Order | void {
		return this.orders[id];
	}

	placeOrder(orderInput: LimitOrderInput | MarketOrderInput): Order {
		let order: Order = {
			price: null,
			...orderInput,
			id: uuid,
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
}