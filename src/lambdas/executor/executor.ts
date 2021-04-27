import { BotCandles, BotConfiguration, TradeBot, BotExecutorPayload, BotExecutorResult } from "../lambda.types";
import * as ts from "typescript";
import Trader from "./Trader";
import botUtils from '../_common/utils/botUtils';
import cons from './Consoler';

export async function executor(event: BotExecutorPayload) {
	// Tweak consoles
	let originalConsole = console;
	// @ts-ignore
	console = cons;

	originalConsole.log('Executor called');

	const bot = getBot(event.botSource);
	if( !bot ){
		return {error: 'bot_unparseable'};
	}

	let {state, error} = getBotState( event, bot );
	if( error ){
		return {error};
	}

	const trader = new Trader(
		event.portfolio, event.orders, event.candles
	);
	
	// Pass a state object that can be updated
	try {
		bot.onData({
			candles: event.candles,
			config: event.config,
			trader,
			state: state,
			utils: botUtils
		});
	}
	catch (err) {
		if (err.stack) {
			error = translateStack(err.stack);
		}
		else {
			console.error( error );
			error = 'unknown_bot_error';
		}
	}

	if( error ){
		console.log('Bot error!', error);
		return {error};
	}

	const logs = cons.getEntries();
	cons.clear();
	return {
		ordersToCancel: trader.ordersToCancel,
		ordersToPlace: trader.ordersToPlace,
		state: state,
		logs
	};
}


function getBot( botCode: string ): TradeBot | void {
	let code = `${botCode}; bot = {initializeState: initializeState, onData: onData};`
	let bot;
	try {
		let jsCode = ts.transpile(code);
		eval(jsCode);
	}
	catch( err ) {
		console.error('Bot code not valid: ', err);
	}
	return bot;
}

function isNewDeployment(event){
	return event.state.newState === 'stateNew';
}


function getBotState( event, bot ){
	let state = { ...event.state };
	let error;
	if (isNewDeployment(event)) {
		state = {};
		if (bot.initializeState) {
			try {
				bot.initializeState(event.config, state);
			}
			catch (err) {
				if (err.stack) {
					error = { error: translateStack(err.stack) };
				}
				else {
					console.error(err);
					error = { error: 'unknown_bot_error' };
				}
			}
		}
	}
	return {state, error};
}

function translateStack( stack: string ): string{
	let parts = stack.split('\n');
	let botErrorParts = [ parts[0] ];
	let i = 1;
	while( i < parts.length ){
		let translated = parts[i].replace(/eval at getBot \([^)]*\), /, '');
		if (translated.includes('<anonymous>') ){
			botErrorParts.push( translated );
			i++;
		}
		else {
			i = parts.length;
		}
	}
	return botErrorParts.join('\n');
}