import { BotConfigurationExtra, BotExecutorResult, BotState, Portfolio } from "../../../../lambdas/lambda.types";
import { ConsoleEntry, DbExchangeAccount, DeploymentOrders, Order, RunnableDeployment } from "../../../../lambdas/model.types";
import { BotRunInput } from "../../../../lambdas/_common/botRunner/BotRunner";
import { ExchangeAdapter, ExchangeOrder } from "../../../../lambdas/_common/exchanges/ExchangeAdapter";

export async function runBotIteration( deploymentId: string, runner: BotRunner ){
	/*
	let deployment: DBBotDeployment = await runner.getDeployment( deploymentId );
	let exchange: DbExchangeAccount = await runner.getExchangeAccount( deployment.exchangeAccountId );
	let adapter: ExchangeAdapter = runner.getAdapter( exchange );
	let bot: RunnableBot = await runner.getBot( deployment.botId );

	if( isNewDeployment( deployment ) ){
		let {state, logs} = await bot.initializeState({
			symbols: getDeploymentSymbols(deployment),
			runInterval: deployment.runInterval,
			exchange: exchange.provider
		});
		deployment = await runner.updateDeployment( deployment, {state, logs} );
	}

	// First get candles (virtual exchanges will refresh its data)
	const [ portfolio, candles ] = await Promise.all([
		adapter.getPortfolio(),
		runner.getCandles( adapter, getDeploymentSymbols(deployment) )
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
		await runner.setRunError( result.error )
		return;
	}

	const cancelledOrders = await runner.cancelOrders( adapter, result.ordersToCancel );
	const placedOrders = await runner.placeOrders( adapter, result.ordersToPlace );
	const updatedOrders = runner.mergeOrders( deployment.orders, cancelledOrders, placedOrders );

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
	*/
}

interface BotInitializeStateResponse {
	state: BotState,
	logs: ConsoleEntry[]
}

interface RunnableBot {
	prepare( source: string ): void,
	initializeState(config: BotConfigurationExtra): Promise<BotInitializeStateResponse>
	run( input: BotRunInput ): Promise<BotExecutorResult>
}

interface BotRunnerDeploymentUpdate {
	state?: BotState,
	orders?: DeploymentOrders,
	logs?: ConsoleEntry[]
}

interface BotRunnerExchangeUpdate {
	orders?: ExchangeOrder[],
	portfolio?: Portfolio
}

interface BotRunner {
	getDeployment( deploymentId: string ): Promise<RunnableDeployment>
	getExchangeAccount( exchangeAccountId: string ): Promise<DbExchangeAccount>
	getAdapter( exchange: DbExchangeAccount ): ExchangeAdapter
	getBot( botId: string ): Promise<RunnableBot>
	updateDeployment( deployment: RunnableDeployment, update: BotRunnerDeploymentUpdate ): Promise<RunnableDeployment>,
	updatePortfolio( exchange: DbExchangeAccount, update: BotRunnerExchangeUpdate): Promise<DbExchangeAccount>,
	setRunError( error: any ): Promise<void>
	cancelOrders( adapter: ExchangeAdapter, ordersToCancel: Order[] ): Promise<Order[]>
	placeOrders( adapter: ExchangeAdapter, ordersToPlace: Order[]): Promise<Order[]>
	mergeOrders( prevOrders: DeploymentOrders, cancelledOrders: Order[], placedOrders: Order[] ): DeploymentOrders
}
