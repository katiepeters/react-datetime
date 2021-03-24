import { BotCandles, BotConfiguration, TradeBot } from "../lambda.types";
import * as ts from "typescript";
import { BotExecutorPayload } from "../_common/utils/lambda";
import Trader from "./Trader";
import botUtils from '../_common/utils/botUtils';

export async function executor(event: BotExecutorPayload) {
	console.log('Executor called');

	const Bot = getBot(event.botSource)
	if( !Bot ){
		return {error: 'bot_unparseable'};
	}

	const trader = new Trader(
		event.portfolio, event.orders
	);

	Bot.onData({
		candles: event.candles,
		config: event.config,
		trader,
		state: event.state,
		utils: botUtils
	})

	console.log('BOT', trader);

	return {
		statusCode: 200,
		body: JSON.stringify(
			{
				message: 'Go Serverless v1.0! Your function executed successfully!',
				input: event,
			},
			null,
			2
		),
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