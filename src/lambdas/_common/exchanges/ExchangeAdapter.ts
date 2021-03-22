export interface CandleQuery {
	exchange: string
	market: string
	interval: '5m' | '10m' | '30m' | '1h' | '4h' | '1d'
	lastCandleAt: number
	candleCount: number
}

export interface ExchangeOrder {
	id: string
	status: 'pending' | 'placed' | 'completed' | 'cancelled' | 'error'
	errorReason: string | null
	price: number | null
	executedPrice: number | null
	createdAt: number
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
	placeOrder(order: LimitOrderInput | MarketOrderInput): Promise<Order>
	cancelOrder(orderId: string): Promise<boolean>
	getOpenOrders(): Promise<ExchangeOrder[]>
	getOrderHistory(): Promise<ExchangeOrder[]>
}