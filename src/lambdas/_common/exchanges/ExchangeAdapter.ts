import { ArrayCandle, OrderInput, Portfolio } from "../../lambda.types";

export type CandleInterval = '5m' | '10m' | '30m' | '1h' | '4h' | '1d' | '1w' | '1mo';
export interface CandleQuery {
	market: string
	runInterval: string
	lastCandleAt: number
	candleCount: number
}

export interface ExchangeOrder {
	id: string
	pair: string
	type: 'limit' | 'market'
	status: 'pending' | 'placed' | 'completed' | 'cancelled' | 'error'
	errorReason: string | null
	direction: 'buy' | 'sell'
	amount: number
	price: number | null
	executedPrice: number | null
	placedAt: number | null
	closedAt: number | null
}

export interface ExchangeOrders {
	[id: string]: ExchangeOrder
}

export interface ExchangeCredentials {
	key: string
	secret: string
}

export interface ExchangeVirtualData {
	portfolio: string,
	orders: string
}

export interface Ticker {
	[pair: string]: PairTicker
}

export interface PairTicker {
	date: number,
	price: number,
	volume: number,
	change: number
}

export interface ExchangePairs {
	[pair:string]: ExchangePair
}

export interface ExchangePair {
	pairKey: string
	minOrder: number
	maxOrder: number
}

export interface ExchangeAdapter {
	getPortfolio(): Promise<Portfolio>
	getCandles(options: CandleQuery): Promise<ArrayCandle[]>
	placeOrders(orders: OrderInput[]): Promise<ExchangeOrder[]>
	cancelOrders(orderIds: string[]): Promise<boolean[]>
	getOrders(ids: string[]): Promise<ExchangeOrder[]>
	getOpenOrders(): Promise<ExchangeOrder[]>
	getOrderHistory(): Promise<ExchangeOrder[]>
	hydrate?: () => Promise<void>
	getTicker: () => Promise<Ticker>
	getPairs: () => Promise<ExchangePairs>
}