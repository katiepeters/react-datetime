/* eslint-disable no-restricted-globals */
import Trader from '../../../../../lambdas/executor/Trader';
import cons from '../../../../../lambdas/executor/Consoler';
import { botRunUtils } from '../../../../../lambdas/_common/botRunner/botRunUtils';
import { BotRunIndicators } from '../../../../../lambdas/_common/botRunner/botRunIndicators';
import { BotRunPatterns } from '../../../../../lambdas/_common/botRunner/botRunPatterns';
import { BotRunPlotter, Plotter } from '../../../../../lambdas/_common/botRunner/botRunPlotter';

// WARNING: This line will be replaced by the bot source code. DO NOT UPDATE
console.log("#BOT");

self.onmessage = function (msg: any ){
	let {input} = msg.data;

	const originalConsole = console;
	// @ts-ignore
	console = cons;

	let state = { ...input.state };
	if (state.newState === 'stateNew') {
		state = {};

		// @ts-ignore
		if( typeof initializeState === 'function' ) {
			// @ts-ignore
			initializeState(input.config, state);
		}
	}
	
	const trader = new Trader(input.portfolio, input.orders, input.candleData);

	const {points, series, indicators: ind, candlestickPatterns: patt} = input.plotterData;
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


	// @ts-ignore
	onData({
		candleData: input.candleData,
		config: input.config,
		trader,
		state,
		utils: botRunUtils,
		indicators,
		candlestickPatterns,
		plotter
	});

	// @ts-ignore
	self.postMessage({
		ordersToCancel: trader.ordersToCancel,
		ordersToPlace: trader.ordersToPlace,
		state: state,
		logs: cons.getEntries(),
		plotterData: {
			series: plotterInstance.series,
			points: plotterInstance.points,
			indicators: Object.keys(indicators.indicatorsUsed),
			candlestickPatterns: Object.keys(candlestickPatterns.patternsUsed)
		}
	});

	cons.clear();
	console = originalConsole;
}


export default function mock() {
	// This is needed just to not have rogue files
}