import { DbExchangeAccount, DeploymentOrders, PortfolioWithPrices, RunnableDeployment } from "../../../lambdas/model.types";
import { Balance, BotCandles, BotExecutorResultWithDate, Order, Portfolio } from "../../lambda.types";
import { ExchangeAdapter, ExchangeOrder } from "../../../lambdas/_common/exchanges/ExchangeAdapter";
import { BotRunner, RunnableBot } from './BotRunner';
import candles from "../utils/candles";

export async function runBotIteration( accountId: string, deploymentId: string, runner: BotRunner ){
	let deployment: RunnableDeployment = await runner.getDeployment( accountId, deploymentId );
	let exchange: DbExchangeAccount = await runner.getExchangeAccount( accountId, deployment.exchangeAccountId );
	let adapter: ExchangeAdapter = await runner.getAdapter( exchange );
	let bot: RunnableBot = await runner.getBot( accountId, deployment.botId, deployment.version );

	// First get candles (virtual exchanges will refresh its data)
	let [ portfolio, candleData ] = await Promise.all([
		adapter.getPortfolio(),
		runner.getCandles( adapter, deployment )
	]);

	// Update the closed orders in the last iteration
	let orders = await getUpdatedOrdersFromExchange( adapter, deployment.orders );
	deployment = await runner.updateDeployment( deployment, {orders} );
	
	const result = await bot.run({
		candleData,
		config: {
			pairs: deployment.pairs,
			runInterval: deployment.runInterval,
			exchange: exchange.provider,
			exchangeType: exchange.type
		},
		state: deployment.state,
		orders: orders,
		portfolio,
		plotterData: deployment.plotterData
	});

	if( result.error ){
		await runner.setRunError( deployment, result.error );
		return;
	}

	console.log(`Orders to cancel/place: ${result.ordersToCancel.length}, ${result.ordersToPlace.length}`);

	const cancelledOrders = await runner.cancelOrders( adapter, deployment.orders, result.ordersToCancel );
	const placedOrders = await runner.placeOrders( adapter, result.ordersToPlace );
	const updatedOrders = mergeResultOrders( deployment.orders, result, cancelledOrders, placedOrders );
	
	// refresh the portfolio after setting the orders
	portfolio = await adapter.getPortfolio();
	
	// Save results
	await Promise.all([
		runner.updateDeployment( deployment, {
			orders: updatedOrders,
			state: result.state,
			logs: [ ...deployment.logs, ...result.logs ],
			portfolioWithPrices: getPortfolioWithPrices( portfolio, deployment.pairs, candleData ),
			lastRunAt: Date.now(),
			plotterData: result.plotterData
		}),
		runner.updateExchange( exchange, {
			orders: runner.getExchangeOrders( adapter ),
			portfolio
		})
	]);
}

function getUpdatedOrdersFromExchange( adapter: ExchangeAdapter, orders: DeploymentOrders ): Promise<DeploymentOrders>{
	let exchangeOrderIds: string[] = [];
	
	orders.openOrderIds.forEach( (orderId: string) => {
		let order =	orders.items[orderId];
		if( order && order.foreignId ){
			exchangeOrderIds.push( order.foreignId );
		}
	});

	if( !exchangeOrderIds.length )
		return Promise.resolve({ ...orders });

	return adapter.getOrders( exchangeOrderIds )
		.then( (exchangeOrders: ExchangeOrder[]) => {
			let {foreignIdIndex, items} = orders;

			let mergedOrders: DeploymentOrders = {
				foreignIdIndex: {...foreignIdIndex},
				items: {...items },
				openOrderIds: []
			}

			exchangeOrders.forEach( exchangeOrder => {
				let storedOrderId = foreignIdIndex[exchangeOrder.id];
				console.log( storedOrderId, items[storedOrderId], exchangeOrder);
				let order = mergeOrder(items[storedOrderId], exchangeOrder);
				mergedOrders.items[storedOrderId] = order;
				if( order.status === 'placed' ){
					mergedOrders.openOrderIds.push( storedOrderId );
				}
			});

			return mergedOrders;
		})
	;

}

function mergeOrder( storedOrder: Order, exchangeOrder: ExchangeOrder ): Order {
	return {
		...exchangeOrder,
		id: storedOrder.id,
		foreignId: exchangeOrder.id,
		createdAt: storedOrder.createdAt,
		marketPrice: storedOrder.marketPrice
	}
}

function mergeResultOrders( currentOrders: DeploymentOrders, result: BotExecutorResultWithDate, cancelledOrderIds: string[], placedOrders: ExchangeOrder[] ) {
	const foreignIdIndex = { ...currentOrders.foreignIdIndex };
	const items = { ...currentOrders.items };

	let closedOrdersIndex = {};
	cancelledOrderIds.forEach( (orderId: string) => {
		if( orderId ){
			items[ orderId ] = {
				...items[orderId],
				status: 'cancelled',
				closedAt: result.currentDate
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


function getEmptyBalance( asset: string ): Balance {
	return {
		asset,
		free: 0,
		total: 0
	}
}

// Portfolio can come from the exchange directly, already having assets
// that are not related to this bot, so we need to use the development pairs
function getPortfolioWithPrices( portfolio: Portfolio, pairs: string[], allCandles: BotCandles ): PortfolioWithPrices {
	const quotedAsset = pairs[0].split('/')[1];
	const baseAssets = pairs.map( (s:string) => s.split('/')[0]);

	// logCandles( allCandles );
	
	let portfolioWithPrices: PortfolioWithPrices = {
		[quotedAsset]: {
			...(portfolio[quotedAsset] || getEmptyBalance(quotedAsset)),
			price: 1
		}
	}

	baseAssets.forEach( (asset: string) => {
		portfolioWithPrices[asset] = {
			...portfolio[asset],
			price: candles.getClose(candles.getLast(allCandles[`${asset}/${quotedAsset}`]))
		}
	});

	return portfolioWithPrices;
}


function logCandles( allCandles: BotCandles ){
	let lengths = {};
	for( let pair in allCandles ){
		lengths[pair] = allCandles[pair].length
	}
	console.log('Candles retrieved', lengths);
}