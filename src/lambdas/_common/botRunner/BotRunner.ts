import { BotCandles, BotConfigurationExtra, BotExecutorResult, BotState, Portfolio, OrderInput, BotExecutorResultWithDate, Orders } from "../../../lambdas/lambda.types";
import { ConsoleEntry, DBBotDeployment, DbExchangeAccount, DeploymentOrders, Order } from "../../../lambdas/model.types";
import { ExchangeAdapter, ExchangeOrder, ExchangeOrders } from "../../../lambdas/_common/exchanges/ExchangeAdapter";

export interface BotInitializeStateResponse {
	state: BotState,
	logs: ConsoleEntry[]
}

export interface RunnableBot {
	prepare(source: string): Promise<void>
	run( input: BotRunInput ): Promise<BotExecutorResultWithDate>
}

export interface BotRunInput {
	candles: BotCandles,
	config: BotConfigurationExtra,
	state: BotState,
	orders: DeploymentOrders,
	portfolio: Portfolio
}

export interface BotRunnerDeploymentUpdate {
	state?: BotState,
	orders?: DeploymentOrders,
	logs?: ConsoleEntry[]
}

export interface BotRunnerExchangeUpdate {
	orders?: ExchangeOrders,
	portfolio: Portfolio
}

export interface BotRunner {
	getDeployment( accountId: string, deploymentId: string ): Promise<DBBotDeployment>
	getExchangeAccount( accountId: string, exchangeAccountId: string ): Promise<DbExchangeAccount>
	getExchangeOrders(adapter: ExchangeAdapter): ExchangeOrders | undefined
	getAdapter( exchange: DbExchangeAccount ): Promise<ExchangeAdapter>
	getCandles( adapter: ExchangeAdapter, deployment: DBBotDeployment ): Promise<BotCandles>
	getBot( accountId: string, botId: string ): Promise<RunnableBot>
	updateDeployment( deployment: DBBotDeployment, update: BotRunnerDeploymentUpdate ): Promise<DBBotDeployment>,
	updateExchange( exchange: DbExchangeAccount, update: BotRunnerExchangeUpdate): Promise<DbExchangeAccount>,
	setRunError( deployment: DBBotDeployment, error: any ): Promise<void>
	cancelOrders( adapter: ExchangeAdapter, currentOrders: DeploymentOrders, ordersToCancel: string[] ): Promise<string[]>
	placeOrders( adapter: ExchangeAdapter, ordersToPlace: Order[] ): Promise<ExchangeOrder[]>
}

export interface CodeErrorInput {
	code: string
	message?: string
	extra?: {[attr: string]: any}
}

export class CodeError extends Error {
	code: string
	extra: { [attr: string]: any }
	constructor(input: CodeErrorInput) {
		let message = input.message || input.code;
		super( message );
		this.code = input.code;
		this.extra = input.extra || {}
	}
}