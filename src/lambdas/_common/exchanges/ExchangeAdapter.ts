import { ArrayCandle, OrderInput, Portfolio } from "../../lambda.types";

export interface CandleQuery {
	market: string
	runInterval: '5m' | '10m' | '30m' | '1h' | '4h' | '1d'
	lastCandleAt: number
	candleCount: number
}

export interface ExchangeOrder {
	id: string
	symbol: string
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

export interface ExchangeCredentials {
	key: string
	secret: string
}

export interface ExchangeVirtualData {
	portfolio: string,
	orders: string
}

export interface Ticker {
	[symbol: string]: SymbolTicker
}

export interface SymbolTicker {
	date: number,
	price: number,
	volume: number,
	change: number
}

export interface ExchangeSymbols {
	[symbol:string]: ExchangeSymbol
}

export interface ExchangeSymbol {
	symbolKey: string
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
	getSymbols: () => Promise<ExchangeSymbols>
}