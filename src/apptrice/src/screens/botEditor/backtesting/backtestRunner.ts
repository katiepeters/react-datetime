import { BacktestConfig } from "../tools/BotTools";
import VirtualAdapter from '../../../../../lambdas/_common/exchanges/adapters/VirtualAdapter';
import apiCacher from "../../../state/apiCacher";
import { ArrayCandle } from "../../../../../lambdas/lambda.types";

export async function runBacktest( botSource: string, options: BacktestConfig ){
	const symbols = getSymbols( options.baseAssets, options.quotedAsset );
	const candles = await getBTCandles( symbols, options.interval, options.startDate, options.endDate );
	const totalIterations = getTotalIterations( candles );
	const bot = createBot( botSource );
	

	let portfolio = getBTPortfolio(options);
	let orders = {};
	let openOrderIds: string[] = [];
	let state = {};

	let iteration = 0;
	while( iteration < totalIterations ){
		let iterationCandles = getIterationCandles( candles, i );
		let adapter = getAdapter( iterationCandles, portfolio, orders, openOrderIds );

		adapter.updateOpenOrders();
		
		let results = await bot.execute({
			portfolio,
			orders: adapter.orders,
			state,
			candles
		});

		state = results.state;
		if( results.ordersToCancel.length > 0 ){
			adapter.cancelOrders( results.ordersToCancel );
		}
		if( results.ordersToPlace.length > 0 ){
			adapter.placeOrders( results.ordersToPlace );
		}
		
		portfolio = adapter.portfolio;
		orders = adapter.orders;
		openOrdersIds = adapter.openOrders;

		iteration++;
	}

	while( get)

	const adapter = createBTAdapter( options );
}


function getSymbols( baseAssets: string[], quotedAsset: string ): string[] {
	return baseAssets.map(base => `${base}/${quotedAsset}`);
}

async function getBTCandles( symbols: string[], interval: string, startDate: number, endDate: number ){
	let start = add200Candles(startDate, interval);

	let promises = symbols.map( symbol => apiCacher.getCandles({
		symbol,
		interval,
		startDate: start,
		endDate
	}));

	let candleArr = await Promise.all( promises );
	let candles: {[symbol: string]: ArrayCandle} = {};
	candleArr.forEach( (res,i) => candles[symbols[i]] = res.data );
	return candles;
}

const intervalTime = {
	'5m': 5 * 60 * 1000,
	'10m': 10 * 60 * 1000,
	'30m': 30 * 60 * 1000,
	'1h': 60 * 60 * 1000,
	'4h': 4 * 60 * 60 * 1000,
	'1d': 24 * 60 * 60 * 1000
};
function add200Candles(start: number, interval: string) {
	// @ts-ignore
	return start - (intervalTime[interval] * 200);
}

function getTotalIterations(candles: { [symbol: string]: ArrayCandle }) {
	let symbol = Object.keys(candles)[0];
	return candles[symbol].length - 200;
}

function createBot( botSoruce: string ){

}