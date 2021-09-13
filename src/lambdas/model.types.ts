import { Balance, Portfolio } from "./lambda.types";
import { ChartSeries, PairPlottingSeries } from "./_common/botRunner/botRunPlotter";

export interface TableItem {
	accountId: string
	resourceId: string
	[attribute: string]: any
}

// ACCOUNT
export interface DBAccount extends TableItem {
	id: string
	resourceId: 'ACCOUNT',
	createdAt: number
}

export interface DBAccountInput {
	id: string
}


// BOT
export interface MinorVersion {
	createdAt: number
	number: number	
}

export interface VersionHistory {
	lastMinor: number
	available: MinorVersion[]
}

export interface BaseBot {
	accountId: string
	name: string
	versions: VersionHistory[]
	createdAt: number
}

export interface DynamoBot extends BaseBot {
	resourceId: string
}

export interface ModelBot extends BaseBot {
	id: string
}

export interface DbBot extends TableItem {
	id: string
	name: string
	versions: VersionHistory[]
	createdAt: number
}

export interface DbBotInput {
	id: string
	name: string
	accountId: string
	versions: VersionHistory[]
}

// BOT VERSION
export interface DbBotVersion extends TableItem {
	botId: string
	number: string
	code: string
	isLocked: boolean
	label: string
	createdAt: number
	updatedAt: number
}


// BOT DEPLOYMENT

export type RunInterval = '5m' | '10m' | '30m' | '1h' | '4h' | '1d';

export interface Order extends OrderInput {
	id: string
	foreignId: string | null
	status: 'pending' | 'placed' | 'completed' | 'cancelled' | 'error'
	errorReason: string | null
	price: number | null
	executedPrice: number | null
	marketPrice: number
	createdAt: number
	placedAt: number | null
	closedAt: number | null
}

export interface DeploymentOrders {
	foreignIdIndex: { [foreignId: string]: string }
	items: { [orderId: string]: Order }
	openOrderIds: string[]
}

export interface DBBotDeploymentState {
	[attribute: string]: any
}

export interface PlotterData {
	indicators: string[]
	candlestickPatterns: string[]
	series: PairPlottingSeries
	points: PairPlottingSeries
}

export interface PairPlotterData {
	indicators: string[]
	candlestickPatterns: string[]
	series: ChartSeries
	points: ChartSeries
}

type ActiveIntervalClosed = [number, number]
type ActiveIntervalOpen = [number]
export type ActiveInterval = ActiveIntervalClosed | ActiveIntervalOpen
export interface BasicBotDeploymentStats {
	startingBalances: PortfolioWithPrices,
	lastWeekPortfolio: PortfolioHistoryItem[]
}

export interface BaseBotDeployment {
	botId: string
	version: string
	exchangeAccountId: string

	createdAt: number
	lastRunAt?: number
	name: string

	runInterval: string
	pairs: string[]

	activeIntervals: ActiveInterval[]
	stats?: BasicBotDeploymentStats
}

export interface DynamoBotDeployment extends TableItem, BaseBotDeployment {
	active?: string
}

export interface ModelBotDeployment extends BaseBotDeployment {
	id: string
	accountId: string
	active: boolean
}

export interface FullBotDeployment extends ModelBotDeployment {
	orders: DeploymentOrders
	state: DBBotDeploymentState
	logs: ConsoleEntry[]
	portfolioHistory: PortfolioHistoryItem[]
	plotterData: PlotterData
}

export interface CreateBotDeploymentModelInput {
	accountId: string
	id: string
	name: string
	botId: string
	version: string
	exchangeAccountId: string
	runInterval: RunInterval
	pairs: string[]
	orders: DeploymentOrders
	portfolioHistory?: PortfolioHistoryItem[]
	state?: DBBotDeploymentState
	logs?: ConsoleEntry[]
	plotterData?: PlotterData
	active: boolean
	createdAt?: number
	activeIntervals?: ActiveInterval[]
	stats?: BasicBotDeploymentStats
}

export interface UpdateBotDeploymentModelInput {
	stats?: BasicBotDeploymentStats
	version?: string
	runInterval?: RunInterval
	pairs?: string[]
	orders?: DeploymentOrders
	state?: DBBotDeploymentState
	logs?: ConsoleEntry[]
	portfolioHistory?: PortfolioWithPrices
	plotterData?: PlotterData
}

export interface ActivityDeployment {
	active: boolean,
	activeIntervals?: ActiveInterval[]
}

export interface RunnableDeployment {
	id: string
	accountId: string
	exchangeAccountId: string
	botId: string
	version: string
	runInterval: string
	pairs: string[]
	orders: DeploymentOrders
	state: DBBotDeploymentState
	logs: ConsoleEntry[]
	portfolioHistory: PortfolioHistoryItem[]
	activeIntervals: ActiveInterval[]
	plotterData: PlotterData
	lastRunAt?: number
}

export interface OrderInput {
	pair: string
	type: 'limit' | 'market'
	direction: 'buy' | 'sell'
	amount: number
}

export interface ConsoleEntry {
	id: number,
	date: number,
	type: 'error' | 'warn' | 'log',
	message: string
}


// EXCHANGE ACCOUNT
export interface DbExchangeAccount extends TableItem {
	id: string
	name: string
	provider: 'bitfinex'
	type: 'real' | 'virtual'
	key?: string
	secret?: string
}

export interface PortfolioHistoryItem {
	date: number
	balances: PortfolioWithPrices
}

export interface PortfolioWithPrices {
	[asset: string]: BalanceWithPrice
}

export interface BalanceWithPrice extends Balance {
	price: number
}

export interface CreateExchangeAccountInput {
	accountId: string
	id: string
	name: string
	provider: 'bitfinex'
	type: 'real' | 'virtual'
	key?: string
	secret?: string
	initialBalances: Portfolio
}

export interface DbExchangeAccountInput {
	accountId: string
	id: string
	name: string
	provider: 'bitfinex'
	type: 'real' | 'virtual'
	key?: string
	secret?: string
	initialBalances?: Portfolio
}

export interface ExchangeAccountResponse {
	id: string
	name: string
	accountId: string
	provider: string
	type: string
	key: string
}