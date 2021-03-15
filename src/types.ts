
interface BotConfiguration {
	symbols: string[]
	interval: '5m' | '10m' | '30m' | '1h' | '4h' | '1d'
	exchange: 'bitfinex'
	[key: string]: any
}

interface BotConfigurationExtra {
	[key: string]: any
}

type ArrayCandle = [
	number, number, number, number, number, number
]

type BotCandles = {
	[symbol: string]: ArrayCandle[]
}

type BotState = {
	[attribute: string]: any
}

