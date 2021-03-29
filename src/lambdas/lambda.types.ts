export interface BotConfigurationExtra {
	[key: string]: any
}

export type ArrayCandle = [
	number, number, number, number, number, number
]

export type BotCandles = {
	[symbol: string]: ArrayCandle[]
}

export type BotState = {
	[attribute: string]: any
}

export type ExchangeProvider = 'bitfinex' | 'virtual'

export interface BotConfiguration {
	symbols: string[]
	interval: '5m' | '10m' | '30m' | '1h' | '4h' | '1d'
	exchange: ExchangeProvider
	[key: string]: any
}

export interface Trader {
	getPortfolio(): Portfolio
	getOrder(id: string): Order | void
	placeOrder(orderInput: OrderInput): Order
	cancelOrder(orderId: string)
}

export interface CandleUtils {
	getLast(candles: ArrayCandle[]): ArrayCandle
	getTime(candle: ArrayCandle): number
	getOpen(candle: ArrayCandle): number
	getClose(candle: ArrayCandle): number
	getHigh(candle: ArrayCandle): number
	getLow(candle: ArrayCandle): number
	getVolume(candle: ArrayCandle): number
	getMiddle(candle: ArrayCandle): number
	getAmplitude(candle: ArrayCandle): number
}

export interface SymbolsUtils {
	getBase(symbol: string): string
	getQuoted(symbol: string): string
}

export interface BotUtils {
	candles: CandleUtils
	symbols: SymbolsUtils
}

export interface BotInput {
	candles: BotCandles
	config: BotConfiguration
	trader: Trader
	state: BotState,
	utils: BotUtils
}

export interface Balance {
	asset: string,
	free: number,
	total: number
}

export interface Portfolio {
	[asset: string]: Balance
}

export interface OrderInput {
	id: string
	symbol: string
	type: 'limit' | 'market'
	direction: 'buy' | 'sell'
	amount: number
	price: number | null
}

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

export interface Orders {
	[orderId: string]: Order
}

export abstract class TradeBot {
	extraConfiguration(): BotConfigurationExtra {
		return {}
	}
	abstract onData(input: BotInput): void
}
export interface BotExecutorPayload {
	botSource: string,
	candles: BotCandles,
	config: BotConfiguration,
	state: BotState,
	orders: Orders,
	portfolio: Portfolio
}

export interface BotExecutorResult {
	ordersToCancel: string[]
	ordersToPlace: Order[]
	state: BotState
}