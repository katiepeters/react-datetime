import { TradeBot, BotExecutorPayload } from "../lambda.types";
import * as ts from "typescript";
import Trader from "./Trader";
import cons from './Consoler';
import { botRunUtils } from "../_common/botRunner/botRunUtils";
import { BotRunIndicators } from "../_common/botRunner/botRunIndicators";
import { BotRunPatterns } from "../_common/botRunner/botRunPatterns";
import { BotRunPlotter, Plotter } from "../_common/botRunner/botRunPlotter";

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
		event.portfolio, event.orders, event.candleData
	);

	const {points, series, indicators: ind, candlestickPatterns: patt} = event.plotterData;
	const indicators = new BotRunIndicators( ind );
	const candlestickPatterns = new BotRunPatterns( patt );
	const plotterInstance = new BotRunPlotter({
		points, series, timestamp: Date.now()
	});

	const plotter: Plotter = {
		plotPoint(name, value, pair, chart){
			return plotterInstance.plotPoint(name, value, pair, chart);
		},
		plotSeries(name, value, pair, chart){
			return plotterInstance.plotSeries(name, value, pair, chart);
		}
	}
	
	// Pass a state object that can be updated
	try {
		bot.onData({
			candleData: event.candleData,
			config: event.config,
			trader,
			state: state,
			utils: botRunUtils,
			indicators,
			candlestickPatterns,
			plotter
		});
	}
	catch (err) {
		if (err.stack) {
			error = translateStack(err.stack, bot.sourceCompiled);
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
		logs,
		plotterData: {
			series: plotterInstance.series,
			points: plotterInstance.points,
			indicators: Object.keys(indicators.indicatorsUsed),
			candlestickPatterns: Object.keys(candlestickPatterns.patternsUsed)
		}
	};
}


function getBot( botCode: string ): TradeBot | void {
	let code = `${botCode}; bot = {initializeState: initializeState, onData: onData};`
	let bot;
	try {
		let jsCode = ts.transpile(code);
		eval(jsCode);
		bot.sourceCompiled = jsCode;
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
					error = { error: translateStack(err.stack, bot.sourceCompiled) };
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

function translateStack( stack: string, source?:string ): string{
	let parts = stack.split('\n');
	let botErrorParts = [ parts[0] ];
	let i = 1;
	if( source ){
		let withLines = source.split('\n').map( (l,i) => `${i+1}: ${l}` ).join('\n');
		// console.log( withLines );
	}
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