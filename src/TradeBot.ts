import Trader from "./runner/Trader"
import utils from './utils/utils';
export interface BotInput {
	candles: BotCandles
	config: BotConfiguration
	trader: Trader
	state: BotState,
	utils: typeof utils
}

export abstract class TradeBot {
	extraConfiguration(): BotConfigurationExtra  {
		return {}
	} 
	abstract onData(input: BotInput): void
}