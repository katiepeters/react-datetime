import { ConsoleEntry, DeploymentOrders } from "./model.types"
import { Indicators } from "./_common/botRunner/botRunIndicators"
import { Patterns } from "./_common/botRunner/botRunPatterns"
import { PairPlottingSeries, Plotter } from "./_common/botRunner/botRunPlotter"
import { BotRunUtils } from "./_common/botRunner/botRunUtils"

export interface BotConfigurationExtra{
	[key: string]: any
}

export type ArrayCandle = [
	number, number, number, number, number, number
]

export type BotCandles = {
	[pair: string]: ArrayCandle[]
}

export type BotState = {
	[attribute: string]: any
}

export type ExchangeProvider = 'bitfinex' | 'virtual'

export interface BotConfiguration {
	pairs: string[]
	runInterval: '5m' | '10m' | '30m' | '1h' | '4h' | '1d'
	exchange: ExchangeProvider
	[key: string]: any
}

export interface Trader {
	getPortfolio(): Portfolio
	getOrder(id: string): Order | void
	placeOrder(orderInput: OrderInput): Order
	cancelOrder(orderId: string): void
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

export interface PairsUtils {
	getBase(pair: string): string
	getQuoted(pair: string): string
}

export interface BotUtils {
	candles: CandleUtils
	pairs: PairsUtils
}

export interface BotInput {
	candleData: BotCandles,
	config: BotConfiguration
	state: BotState
	trader: Trader
	utils: BotRunUtils
	indicators: Indicators
	candlestickPatterns: Patterns
	plotter: Plotter
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
	pair: string
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
	marketPrice: number
	createdAt: number
	placedAt: number | null
	closedAt: number | null
}

export interface Orders {
	[orderId: string]: Order
}

export interface TradeBot {
	initializeState?(config: BotConfigurationExtra, state: BotState): void
	onData(input: BotInput): void
}

export interface BotExecutorPayload {
	botSource: string,
	candles: BotCandles,
	config: BotConfiguration,
	state: BotState,
	orders: DeploymentOrders,
	portfolio: Portfolio,
	plotterData: {
		indicators: string[],
		candlestickPatterns: string[],
		series: PairPlottingSeries
		points: PairPlottingSeries
	}
}

export interface BotExecutorResult {
	ordersToCancel: string[]
	ordersToPlace: Order[]
	state: BotState,
	logs: ConsoleEntry[],
	plotterData: {
		indicators: string[],
		candlestickPatterns: string[],
		series: PairPlottingSeries
		points: PairPlottingSeries
	}
	error?: string
}

export interface BotExecutorResultWithDate extends BotExecutorResult {
	currentDate: number
}