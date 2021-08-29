import { ArrayCandle } from "../lambda.types"

interface BotConfigurationExtra {
	[key: string]: any
}

type BotCandles = {
	[pair: string]: ArrayCandle[]
}

type BotState = {
	[attribute: string]: any
}

interface BotConfiguration {
	pairs: string[]
	runInterval: '5m' | '10m' | '30m' | '1h' | '4h' | '1d'
	exchange: 'bitfinex'
	[key: string]: any
}

interface Trader {
	getPortfolio(): Portfolio
	getOrder(id: string): Order | void
	placeOrder(orderInput: LimitOrderInput | MarketOrderInput): Order
	cancelOrder(orderId: string)
}

interface CandleUtils {
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

interface PairsUtils {
	getBase(pair: string): string
	getQuoted(pair: string): string
}

interface BotUtils {
	candles: CandleUtils
	pairs: PairsUtils
}

interface BotInput {
	candles: BotCandles
	config: BotConfiguration
	trader: Trader
	state: BotState,
	utils: BotUtils
}

interface Balance {
	asset: string,
	free: number,
	locked: number
}

interface Portfolio {
	[asset: string]: Balance
}

interface OrderInput {
	id: string
	pair: string
	type: 'limit' | 'market'
	direction: 'buy' | 'sell'
	amount: number
}

interface Order extends OrderInput {
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

interface LimitOrderInput extends OrderInput {
	type: 'limit'
	price: number
}

interface MarketOrderInput extends OrderInput {
	type: 'market'
}

interface Orders {
	[orderId: string]: Order
}

abstract class TradeBot {
	extraConfiguration(): BotConfigurationExtra {
		return {}
	}
	abstract onData(input: BotInput): void
}