import { Order } from "../../lambda.types";
import { DeploymentOrders } from "../../model.types";
import { ExchangeOrder } from "../exchanges/ExchangeAdapter";

export function mergeOrders( orders: DeploymentOrders, exchangeOrders: ExchangeOrder[] ) {
	let {foreignIdIndex, items} = orders;

	let mergedOrders: DeploymentOrders = {
		foreignIdIndex: {...foreignIdIndex},
		items: {...items },
		openOrderIds: []
	}
	
	exchangeOrders.forEach( exchangeOrder => {
		let storedOrderId = foreignIdIndex[exchangeOrder.id];
		let order = mergeOrder(items[storedOrderId], exchangeOrder);
		mergedOrders.items[storedOrderId] = order;
		if( order.status === 'placed' ){
			mergedOrders.openOrderIds.push( storedOrderId );
		}
	});

	return mergedOrders;
}

export function mergeOrder( storedOrder: Order, exchangeOrder: ExchangeOrder ): Order {
	console.log('Mergin order, stored - exchange', storedOrder, exchangeOrder);
	return {
		...exchangeOrder,
		id: storedOrder.id,
		foreignId: exchangeOrder.id,
		createdAt: storedOrder.createdAt,
		marketPrice: storedOrder.marketPrice
	}
}