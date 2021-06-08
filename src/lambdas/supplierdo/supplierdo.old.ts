import BotDeploymentModel from '../_common/dynamo/BotDeploymentModel';
import BotModel from '../_common/dynamo/BotModel';
import ExchangeAccountModel from '../_common/dynamo/ExchangeAccountModel';
import { ExchangeAdapter, ExchangeOrder } from '../_common/exchanges/ExchangeAdapter';
import exchanger from '../_common/exchanges/exchanger';
import exchangeUtils from '../_common/exchanges/exchangeUtils';
import lambdaUtil from '../_common/utils/lambda';
import { Order, BotExecutorPayload, Portfolio, BotCandles } from '../lambda.types';
import { DbBot, DBBotDeployment, DbExchangeAccount, DeploymentOrders } from '../model.types';
import { mergeOrders, mergeOrder } from '../_common/utils/virtualOrders';

export async function supplierdo({ accountId, deploymentId }) {
	try {
		await handleRunRequest( accountId, deploymentId );
	}
	catch(err) {
		console.error(err);
		return {error: err.code};
	}

	return {error: false};
}

async function handleRunRequest( accountId: string, deploymentId: string ) {
	console.log('Supplierdo here!');
	
	// Get data
	const {bot, exchangeAccount, deployment} = await getModels(accountId, deploymentId);
	const exchangeAdapter = getAdapter(accountId, exchangeAccount);
	const { portfolio, orders: exchangeOrders, candles } = await getExchangeData( exchangeAdapter, deployment );

	console.log('All data ok', exchangeOrders);

	// Store any updated order from the last run
	console.log('Updating open orders', deployment.orders.openOrderIds);
	const orders = mergeOrders( deployment.orders, exchangeOrders );
	BotDeploymentModel.update({
		accountId: accountId, 
		deploymentId: deployment.id, 
		update: {orders}
	});


	console.log('Orders updated');

	// Run the bot
	const botInput: BotExecutorPayload = {
		botSource: bot?.code,
		candles: candles,
		config: {
			symbols: deployment.symbols,
			runInterval: deployment.runInterval,
			exchange: exchangeAccount.provider,
			exchangeType: exchangeAccount.type
		},
		state: deployment.state,
		orders: orders,
		portfolio
	}

	console.log('Invoking executor');
	const result = await lambdaUtil.invokeExecutor(botInput);
	if( result.error ){
		// When the bot finishes in an error we probably want to log the error
		// for the user and then deactivate the deployment
		console.log('The execution ended in an error', result.error);
		await BotDeploymentModel.deactivate({ accountId, deploymentId });
		// this is just for testing
		// await BotDeploymentModel.activate({ accountId, deploymentId });
		return;
	}

	console.log('Placing and cancelling orders', result);
	const ordersToPlace = filterOrderToPlaceSymbols( result.ordersToPlace, deployment.symbols );

	// Update orders
	await cancelOrders( exchangeAdapter, result.ordersToCancel, orders );
	await placeOrders( exchangeAdapter, ordersToPlace, orders );

	// Update exchange stats
	const isVirtual = exchangeAccount.type === 'virtual';
	let promises = [
		ExchangeAccountModel.updatePortfolio(accountId, exchangeAccount.id, portfolio, isVirtual)
	];
	if( isVirtual ){
		// @ts-ignore 
		ExchangeAccountModel.updateOrders(accountId, exchangeAccount.id, exchangeAdapter.orders )
	}
	await Promise.all(promises);

	// Store bot results
	console.log('Setting state', result.state);
	await BotDeploymentModel.update({
		accountId, 
		deploymentId: deployment.id,
		update: {
			orders,
			state: result.state,
			logs: [
				...deployment.logs,
				...result.logs
			]
		}
	});
}
interface ExchangeData {
	portfolio: Portfolio
	orders: ExchangeOrder[],
	candles: BotCandles
}
async function getExchangeData( adapter: ExchangeAdapter, deployment: DBBotDeployment ): Promise<ExchangeData>{
	if( adapter.hydrate ){
		await adapter.hydrate();
	}

	// First get candles (virtual exchanges will refresh its data)
	const [ portfolio, candles ] = await Promise.all([
		adapter.getPortfolio(),
		getCandles( adapter, deployment )
	]);

	// Then get updated orders (virtual exchanges will use previously fetched candles)
	let orderIds: string[] = [];
	deployment.orders?.openOrderIds.forEach( orderId => {
		let order = deployment.orders.items[orderId];
		if( order?.foreignId ){
			orderIds.push( order.foreignId );
		}
	});

	const orders = orderIds.length ?
		await adapter.getOrders(orderIds) :
		[]
	;

	return { portfolio, orders, candles };
}

async function getCandles( adapter: ExchangeAdapter, deployment: any ) {
	let promises = deployment.symbols.map( (symbol:string) => adapter.getCandles({
		market: symbol,
		runInterval: deployment.runInterval,
		lastCandleAt: exchangeUtils.getLastCandleAt(deployment.runInterval, Date.now()),
		candleCount: 200
	}));

	let results = await Promise.all(promises);
	let candles = {};
	deployment.symbols.forEach( (symbol,i) => candles[symbol] = results[i] );
	return candles;
}


interface BotModels {
	deployment: DBBotDeployment,
	exchangeAccount: DbExchangeAccount,
	bot: DbBot
}

interface CodeErrorInput {
	code: string
	message?: string
	extra?: {[attr: string]: any}
}
class CodeError extends Error {
	code: string
	extra: { [attr: string]: any }
	constructor(input: CodeErrorInput) {
		let message = input.message || input.code;
		super( message );
		this.code = input.code;
		this.extra = input.extra || {}
	}
}

async function getModels( accountId: string, deploymentId: string ): Promise<BotModels> {
	const deployment = await BotDeploymentModel.getSingle(accountId, deploymentId);

	if (!deployment) {
		throw new CodeError({code: 'unknown_deployment'});
	}

	const [bot, exchangeAccount] = await Promise.all([
		BotModel.getSingle(accountId, deployment.botId),
		ExchangeAccountModel.getSingle(accountId, deployment.exchangeAccountId)
	]);

	if (!bot) {
		throw new CodeError({ code: 'unknown_bot' });
	}

	if (!exchangeAccount) {
		throw new CodeError({ code: 'unknown_exchangeAccount' });
	}

	return {
		deployment, exchangeAccount, bot
	};
}

function getAdapter( accountId: string, exchangeAccount: DbExchangeAccount ): ExchangeAdapter {
	console.log('Get adapter', exchangeAccount);
	const exchangeAdapter = exchanger.getAdapter( exchangeAccount );

	if (!exchangeAdapter) {
		throw new CodeError({ code: 'unknown_adapter', extra: { adapter: exchangeAccount.key } });
	}

	return exchangeAdapter;
}

async function cancelOrders(exchangeAdapter: ExchangeAdapter, orderIds: string[], storedOrders: DeploymentOrders ): Promise<void> {
	if(!orderIds.length) return;

	let ordersToClose = {};
	let foreignIds: string[] = [];
	orderIds.forEach(id => {
		let order = storedOrders.items[id];
		if (!order || !order.foreignId) {
			return console.warn(`Trying to cancel an unknown order ${id}`);
		}

		ordersToClose[id] = true;
		foreignIds.push(order.foreignId);
	});

	console.log('cancelling orders', foreignIds);
	await exchangeAdapter.cancelOrders(foreignIds);

	orderIds.forEach(id => {
		if (storedOrders.items[id]) {
			storedOrders.items[id].status = 'cancelled';
			storedOrders.items[id].closedAt = Date.now();
		}
	});

	storedOrders.openOrderIds = storedOrders.openOrderIds.filter( id => !ordersToClose[id] );
}

async function placeOrders(exchangeAdapter: ExchangeAdapter, ordersToPlace: Order[], storedOrders: DeploymentOrders ): Promise<void> {
	if (!ordersToPlace.length) return;
	
	// @ts-ignore
	let placedOrders = await exchangeAdapter.placeOrders(ordersToPlace);
	console.log('Placed orders', placedOrders);
	let ordersToUpdate = placedOrders.map((placed, i) => (
		mergeOrder(ordersToPlace[i], placed)
	));

	console.log('placing orders', ordersToUpdate.length);
	ordersToUpdate.forEach(order => {
		storedOrders.items[order.id] = order;
		if (order.foreignId) {
			storedOrders.foreignIdIndex[order.foreignId] = order.id;
		}
		storedOrders.openOrderIds.push(order.id);
	});
}

function filterOrderToPlaceSymbols( allOrders: Order[], symbols: string[] ): Order[] {
	let symbolMap = new Set(symbols);
	let toPlace: Order[] = [];
	allOrders.forEach( order => {
		if( symbolMap.has(order.symbol) ){
			toPlace.push(order);
		}
		else {
			console.warn(`Order symbol ${order.symbol} is not in the configured ones. Order won't be placed.`);
		}
	});
	return toPlace;
}