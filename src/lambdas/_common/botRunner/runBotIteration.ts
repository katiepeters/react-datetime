import { DBBotDeployment, DbExchangeAccount, DeploymentOrders } from "../../../lambdas/model.types";
import { BotExecutorResult, Order } from "../../lambda.types";
import { ExchangeAdapter, ExchangeOrder } from "../../../lambdas/_common/exchanges/ExchangeAdapter";
import { BotRunner, RunnableBot } from './BotRunner';

export async function runBotIteration( accountId: string, deploymentId: string, runner: BotRunner ){
	let deployment: DBBotDeployment = await runner.getDeployment( accountId, deploymentId );
	let exchange: DbExchangeAccount = await runner.getExchangeAccount( accountId, deployment.exchangeAccountId );
	let adapter: ExchangeAdapter = runner.getAdapter( exchange );
	let bot: RunnableBot = await runner.getBot( accountId, deployment.botId );

	// First get candles (virtual exchanges will refresh its data)
	const [ portfolio, candles ] = await Promise.all([
		adapter.getPortfolio(),
		runner.getCandles( adapter, deployment )
	]);

	// Update the closed orders in the last iteration
	let orders = await getUpdatedOrdersFromExchange( adapter, deployment.orders );
	deployment = await runner.updateDeployment( deployment, {orders} );
	
	const result = await bot.run({
		candles,
		config: {
			symbols: deployment.symbols,
			runInterval: deployment.runInterval,
			exchange: exchange.provider,
			exchangeType: exchange.type
		},
		state: deployment.state,
		orders: orders,
		portfolio
	});

	if( result.error ){
		await runner.setRunError( deployment, result.error );
		return;
	}

	const cancelledOrders = await runner.cancelOrders( adapter, deployment.orders, result.ordersToCancel );
	const placedOrders = await adapter.placeOrders( result.ordersToPlace );
	const updatedOrders = mergeResultOrders( deployment.orders, result, cancelledOrders, placedOrders );

	// Save results
	await Promise.all([
		runner.updateDeployment( deployment, {
			orders: updatedOrders,
			state: result.state,
			logs: [ ...deployment.logs, ...result.logs ]
		}),
		runner.updateExchange( exchange, {
			orders: exchange.orders,
			portfolio: await adapter.getPortfolio()
		})
	]);
}

function getUpdatedOrdersFromExchange( adapter: ExchangeAdapter, orders: DeploymentOrders ): Promise<DeploymentOrders>{
	let exchangeOrderIds: string[] = [];
	
	orders.openOrderIds.forEach( (orderId: string) => {
		let exchangeOrderId =	orders.foreignIdIndex[orderId];
		if( exchangeOrderId ){
			exchangeOrderIds.push( exchangeOrderId );
		}
	});

	if( !exchangeOrderIds.length )
		return Promise.resolve({ ...orders });

	return adapter.getOrders( exchangeOrderIds ).then( (exchangeOrders: ExchangeOrder[]) => {
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
	});
}


function mergeOrder( storedOrder: Order, exchangeOrder: ExchangeOrder ): Order {
	console.log('Mergin order, stored - exchange', storedOrder, exchangeOrder);
	return {
		...exchangeOrder,
		id: storedOrder.id,
		foreignId: exchangeOrder.id,
		createdAt: storedOrder.createdAt,
		marketPrice: storedOrder.marketPrice
	}
}

function mergeResultOrders( currentOrders: DeploymentOrders, result: BotExecutorResult, cancelledOrderIds: string[], placedOrders: ExchangeOrder[] ) {
	const foreignIdIndex = { ...currentOrders.foreignIdIndex };
	const items = { ...currentOrders.items };

	let closedOrdersIndex = {};
	cancelledOrderIds.forEach( (orderId: string) => {
		if( orderId ){
			items[ orderId ] = {
				...items[orderId],
				status: 'cancelled',
				closedAt: Date.now()
			}
			closedOrdersIndex[ orderId ] = 1;
		}
	});

	let openOrderIds = currentOrders.openOrderIds.filter( (orderId: string) => !closedOrdersIndex[orderId] );
	placedOrders.forEach( (exchangeOrder: ExchangeOrder, i: number) => {
		const deploymentOrder = result.ordersToPlace[i];
		const order = mergeOrder( deploymentOrder, exchangeOrder );
		items[ deploymentOrder.id ] = order;
		foreignIdIndex[ exchangeOrder.id ] = order.id;
		if( order.status === 'placed' ){
			openOrderIds.push( order.id );
		}
	});

	return {
		foreignIdIndex, items, openOrderIds
	}
}

