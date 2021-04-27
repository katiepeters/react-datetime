import { ExchangeProvider } from "./lambda.types";

export interface TableItem {
	accountId: string
	resourceId: string
	[attribute: string]: any
}

// ACCOUNT
export interface DBAccount extends TableItem {
	id: string
	resourceId: 'ACCOUNT'
}

export interface DBAccountInput {
	id: string
}


// BOT
export interface DbBot extends TableItem {
	id: string
	name: string
	code: string
}

export interface DbBotInput {
	id: string
	name: string
	accountId: string
	code: string
}


// BOT DEPLOYMENT

export interface Order extends OrderInput {
	id: string
	foreignId: string | null
	status: 'pending' | 'placed' | 'completed' | 'cancelled' | 'error'
	errorReason: string | null
	price: number | null
	executedPrice: number | null
	createdAt: number
	placedAt: number | null
	closedAt: number | null
}

export interface DeploymentOrders {
	foreignIdIndex: { [foreignId: string]: string }
	items: { [orderId: string]: Order }
}

export interface DBBotDeploymentConfig {
	exchangeAccountId: string
	exchangeType: ExchangeProvider
	runInterval: '5m' | '10m' | '30m' | '1h' | '4h' | '1d'
	symbols: string[]
}

export interface DBBotDeploymentState {
	[attribute: string]: any
}

export interface SimpleBotDeployment {
	id: string
	accountId: string
	botId: string
	config: string
}

export interface DBBotDeployment extends TableItem {
	id: string
	botId: string
	orders: DeploymentOrders
	exchangeAccountId: string
	runInterval: '5m' | '10m' | '30m' | '1h' | '4h' | '1d'
	symbols: string[]
	state: DBBotDeploymentState
	active: string
}

export interface DBBotDeploymentRaw extends TableItem {
	id: string
	botId: string
	exchangeAccountId: string
	runInterval: '5m' | '10m' | '30m' | '1h' | '4h' | '1d'
	symbols: string[]
	orders: string
	state: string
	active:string
}

export interface DBBotDeploymentInput {
	accountId: string
	id: string
	botId: string
	exchangeAccountId: string
	runInterval: '5m' | '10m' | '30m' | '1h' | '4h' | '1d'
	symbols: string[]
	orders: DeploymentOrders
	state?: DBBotDeploymentState
	active: string
}

export interface DBBotDeploymentUpdate {
	botId?: string
	runInterval?: '5m' | '10m' | '30m' | '1h' | '4h' | '1d'
	symbols?: string[]
	orders?: DeploymentOrders
	state?: DBBotDeploymentState
	active?: string
}

export interface OrderInput {
	symbol: string
	type: 'limit' | 'market'
	direction: 'buy' | 'sell'
	amount: number
}


// EXCHANGE ACCOUNT
export interface DbExchangeAccount extends TableItem {
	id: string
	provider: 'bitfinex'
	type: 'real' | 'virtual'
	key: string
	secret: string
}

export interface DbExchangeAccountInput {
	accountId: string
	id: string
	provider: 'bitfinex'
	type: 'real' | 'virtual'
	key: string
	secret: string
}
