import { BotCandles, BotConfiguration, TradeBot, BotExecutorPayload, BotExecutorResult } from "../lambda.types";
import * as ts from "typescript";
import Trader from "./Trader";
import botUtils from '../_common/utils/botUtils';

export async function executor(event: BotExecutorPayload) {
	console.log('Executor called');

	const Bot = getBot(event.botSource)
	if( !Bot ){
		return {error: 'bot_unparseable'};
	}

	const trader = new Trader(
		event.portfolio, event.orders, event.candles
	);
	
	// Pass a state object that can be updated
	let state = {...event.state};
	Bot.onData({
		candles: event.candles,
		config: event.config,
		trader,
		state: state,
		utils: botUtils
	});

	return {
		ordersToCancel: trader.ordersToCancel,
		ordersToPlace: trader.ordersToPlace,
		state: state
	};
}


function getBot( botCode: string ): TradeBot | void {
	let code = `class Bot ${botCode.split(/extends\s+TradeBot/)[1]}; Bot;`;
	let Bot;
	try {
		let jsCode = ts.transpile(code);
		Bot = eval(jsCode);
	}
	catch( err ) {
		console.error('Bot code not valid: ', err);
	}
	if( Bot ){
		return new Bot();
	}
}