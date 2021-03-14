import Trader from "./runner/Trader"

interface BotConfiguration {
	symbols: string
	interval: '5m' | '10m' | '30m' | '1h' | '4h' | '1d'
	exchange: 'bitfinex' 
	[key:string]: string
}

interface BotConfigurationExtra {
	[key:string]: 'string' | string[]
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

interface BotInput {
	candles: BotCandles
	config: BotConfiguration
	trader: Trader
	state: BotState
}

interface TradeBot {
	extraConfiguration: () => BotConfigurationExtra
	onData(input: BotInput): void
}