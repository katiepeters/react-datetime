import { Portfolio } from "./lambda.types";

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
export type BotVersions = VersionHistory[];
export interface DbBot extends TableItem {
	id: string
	name: string
	versions: BotVersions
	createdAt: number
}

export interface DbBotInput {
	id: string
	name: string
	accountId: string
	versions: BotVersions
}

// BOT VERSION
export interface DbBotVersion extends TableItem {
	botId: string,
	number: string,
	code: string
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

type ActiveIntervalClosed = [number, number]
type ActiveIntervalOpen = [number]
type ActiveInterval = ActiveIntervalClosed | ActiveIntervalOpen

export interface SimpleBotDeployment {
	id: string
	name: string
	accountId: string
	botId: string
	exchangeAccountId: string
	runInterval: RunInterval
	symbols: string[]
	createdAt: number
	activeIntervals: ActiveInterval[]
	active: boolean
}

export interface DBBotDeployment extends TableItem {
	id: string
	name: string
	botId: string
	orders: DeploymentOrders
	exchangeAccountId: string
	runInterval: RunInterval
	symbols: string[]
	state: DBBotDeploymentState
	logs: ConsoleEntry[]
	createdAt: number
	activeIntervals: ActiveInterval[]
	active: boolean
}

export interface DBBotDeploymentRaw extends TableItem {
	id: string
	name: string
	botId: string
	exchangeAccountId: string
	runInterval: RunInterval
	symbols: string[]
	createdAt: number
	activeIntervals: ActiveInterval[]
	active?: string
}

export interface DBBotDeploymentInput {
	accountId: string
	id: string
	name: string
	botId: string
	exchangeAccountId: string
	runInterval: RunInterval
	symbols: string[]
	orders: DeploymentOrders
	state?: DBBotDeploymentState
	logs?: ConsoleEntry[]
	active: boolean
	createdAt?: number
	activeIntervals?: ActiveInterval[]
}

export interface DBBotDeploymentUpdate {
	name?: string
	botId?: string
	runInterval?: RunInterval
	symbols?: string[]
	orders?: DeploymentOrders
	state?: DBBotDeploymentState
	logs?: ConsoleEntry[]
}

export interface OrderInput {
	symbol: string
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
	portfolioHistory?: PortfolioHistoryItem[]
}

export interface PortfolioHistoryItem {
	date: number
	balances: Portfolio
}

export interface ExchangeAccountWithHistory extends DbExchangeAccount {
	portfolioHistory: PortfolioHistoryItem[]
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
	portfolioHistory?: PortfolioHistoryItem[]
}