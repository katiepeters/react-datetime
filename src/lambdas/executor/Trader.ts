import { v4 as uuid } from 'uuid';
import { OrderInput, Order, Orders, Portfolio } from '../lambda.types';

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
}