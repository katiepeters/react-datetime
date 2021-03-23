import { ArrayCandle, LimitOrderInput, MarketOrderInput, Order, Orders, Portfolio } from "../../lambda.types";

export interface CandleQuery {
	exchange: string
	market: string
	interval: '5m' | '10m' | '30m' | '1h' | '4h' | '1d'
	lastCandleAt: number
	candleCount: number
}

export interface ExchangeOrder {
	id: string
	market: string
	type: 'limit' | 'market'
	status: 'pending' | 'placed' | 'completed' | 'cancelled' | 'error'
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
	placeOrder(order: LimitOrderInput | MarketOrderInput): Promise<ExchangeOrder>
	cancelOrder(orderId: string): Promise<boolean>
	getOpenOrders(): Promise<ExchangeOrder[]>
	getOrderHistory(): Promise<ExchangeOrder[]>
}