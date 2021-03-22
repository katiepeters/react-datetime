type ArrayCandle = [
	number, number, number, number, number, number
]

export interface DataFetcherInput {
	exchange: string
	market: string
	interval: '5m' | '10m' | '30m' | '1h' | '4h' | '1d'
	lastCandleAt: number
	candleCount: number
}


export interface DataFetcher {
	fetch: (input: DataFetcherInput) => Promise<ArrayCandle[]>
}