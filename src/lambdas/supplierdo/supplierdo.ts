import BotDeploymentModel from '../_common/dynamo/BotDeploymentModel';
import BotModel from '../_common/dynamo/BotModel';
import ExchangeAccountModel from '../_common/dynamo/ExchangeAccountModel';
import dataFetcher from '../_common/exchangeDataFetcher/exchangeDataFetcher';
import { ExchangeAdapter, ExchangeOrder } from '../_common/exchanges/ExchangeAdapter';
import exchanger from '../_common/exchanges/exchanger';
import exchangeUtils from '../_common/exchanges/exchangeUtils';
import lambdaUtil, {BotExecutorPayload} from '../_common/utils/lambda';
import {v4 as uuid} from 'uuid';
import { Order } from '../lambda.types';

export async function supplierdo({ accountId, deploymentId }) {
	const deployment = await BotDeploymentModel.getSingle(accountId, deploymentId);

	if (!deployment) {
		console.warn(`Supplierdo called on an unknonw deploymentId`, accountId, deploymentId);
		return { statusCode: 404 };
	}

	const [bot, exchangeAccount] = await Promise.all([
		BotModel.getSingle(accountId, deployment.botId),
		ExchangeAccountModel.getSingle(accountId, deployment.config.exchangeAccountId)
	]);

	if( !bot || !exchangeAccount) {
		return {statusCode: 404};
	}

	const exchangeAdapter = exchanger.getAdapter({
		accountId,
		exchange: exchangeAccount.provider,
		key: exchangeAccount.key,
		secret: exchangeAccount.secret
	});

	if( !exchangeAdapter ) {
		return {statusCode: 500};
	}

	const { portfolio, orders: exchangeOrders, candles} = await getExchangeData( exchangeAdapter, deployment.config );
	const orders = mergeOrders( deployment.orders, exchangeOrders );

	BotDeploymentModel.update(accountId, deployment.id, {orders});
	const botInput: BotExecutorPayload = {
		botSource: bot?.code,
		candles: candles,
		config: {
			symbols: deployment.config.symbols,
			interval: deployment.config.interval,
			exchange: 'bitfinex'
		},
		state: deployment.state,
		orders: orders.items,
		portfolio
	}

	lambdaUtil.invokeExecutor(botInput)
		.then( result =>{
			console.log('Result from the executor', result);
		})
	;

	return {
		statusCode: 200,
		body: JSON.stringify(
			{
				message: 'Go Serverless v1.0! Your function executed successfully!',
				input: {accountId, deploymentId},
			},
			null,
			2
		),
	};
}


async function getExchangeData( adapter: ExchangeAdapter, symbols: any ){
	const [ portfolioOrders, candles ] = await Promise.all([
		getPortfolioAndOrders( adapter ),
		getCandles( adapter, symbols )
	]);

	return {
		portfolio: portfolioOrders.portfolio,
		orders: portfolioOrders.orders,
		candles
	};
}

async function getPortfolioAndOrders( adapter: ExchangeAdapter ) {
	const portfolio = await adapter.getPortfolio();
	const openOrders = await adapter.getOpenOrders();
	const closedOrders = await adapter.getOpenOrders();

	return {portfolio, orders: openOrders.concat(closedOrders) };
}

async function getCandles( adapter: ExchangeAdapter, config: any ) {
	let promises = config.symbols.map( (symbol:string) => adapter.getCandles({
		market: symbol,
		interval: config.interval,
		lastCandleAt: exchangeUtils.getLastCandleAt(config.interval, Date.now()),
		candleCount: 200
	}));

	let results = await Promise.all(promises);
	let candles = {};
	config.symbols.forEach( (symbol,i) => candles[symbol] = results[i] );
	return candles;
}

function mergeOrders( orders:any, exchangeOrders: ExchangeOrder[] ) {
	let {foreignIdIndex, items} = orders;

	let mergedOrders = {
		foreignIdIndex: {...foreignIdIndex},
		items: {...items}
	}
	
	exchangeOrders.forEach( exchangeOrder => {
		let storedOrderId = foreignIdIndex[exchangeOrder.id];
		if( storedOrderId ){
			mergedOrders.items[storedOrderId] = mergeOrder( items[storedOrderId], exchangeOrder );
		}
		else {
			let id = uuid();
			mergedOrders.foreignIdIndex[exchangeOrder.id] = id;
			mergedOrders.items[id] = createOrder(id, exchangeOrder);
		}
	});

	return mergedOrders;
}

function mergeOrder( storedOrder: Order, exchangeOrder: ExchangeOrder ): Order {
	return {
		...exchangeOrder,
		id: storedOrder.id,
		foreignId: exchangeOrder.id,
		errorReason: null,
		createdAt: Date.now(),
	}
}

function createOrder( id: string, exchangeOrder: ExchangeOrder ): Order {
	return {
		...exchangeOrder,
		id: id,
		foreignId: exchangeOrder.id,
		errorReason: null,
		createdAt: Date.now()
	}
}