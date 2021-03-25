import { ArrayCandle, LimitOrderInput, MarketOrderInput, Order, Orders, Portfolio } from "../../lambda.types";

export interface CandleQuery {
	market: string
	interval: '5m' | '10m' | '30m' | '1h' | '4h' | '1d'
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

export interface ExchangeAdapter {
	getPortfolio(): Promise<Portfolio>
	getCandles(options: CandleQuery): Promise<ArrayCandle[]>
	placeOrders(orders: (LimitOrderInput | MarketOrderInput)[]): Promise<ExchangeOrder[]>
	cancelOrders(orderIds: string[]): Promise<boolean[]>
	getOpenOrders(): Promise<ExchangeOrder[]>
	getOrderHistory(): Promise<ExchangeOrder[]>
}