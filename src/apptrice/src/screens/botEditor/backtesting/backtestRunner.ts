import { BacktestConfig } from "../tools/BotTools";
import VirtualAdapter from '../../../../../lambdas/_common/exchanges/adapters/VirtualAdapter';
import apiCacher from "../../../state/apiCacher";
import { BotCandles, Orders, Portfolio } from "../../../../../lambdas/lambda.types";
import candles from "../../../../../lambdas/_common/utils/candles";
import {createBot} from './botWorker';

export async function runBacktest( botSource: string, options: BacktestConfig, store: any ){
	const symbols = getSymbols( options.baseAssets, options.quotedAsset );
	const [candles, botWorkerSource] = await Promise.all([
		getBTCandles(symbols, options.interval, options.startDate, options.endDate),
		getWorkerSource()
	]);

	const totalIterations = getTotalIterations( candles );
	const bot = createBot( botSource, botWorkerSource );
	if( !bot ){
		console.log('ERROR creating bot');
		return;
	}

	let portfolio = getBTPortfolio(options);
	let orders = {};
	let openOrderIds: string[] = [];
	let state = {};

	let iteration = 0;
	store.currentBackTesting = {
		active: true,
		iteration, totalIterations
	};

	while( iteration < totalIterations ){
		console.log(`Iteration ${iteration} out of ${totalIterations}`);
		let iterationCandles = getIterationCandles( candles, iteration );
		
		let adapter = getAdapter( iterationCandles, portfolio, orders, openOrderIds );

		adapter.updateOpenOrders();
		
		let results = await bot.execute({
			portfolio,
			orders: adapter.orders,
			state,
			candles: iterationCandles,
			config: {
				symbols,
				interval: options.interval,
				exchange: 'bitfinex'
			}
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
		openOrderIds = adapter.openOrders;

		iteration++;
		store.currentBackTesting.iteration = iteration;

		console.log( Object.keys(orders).length );
	}
	console.log('Backtesting finished');
	store.currentBackTesting.active = false;
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
	let candles: BotCandles = {};
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

function getTotalIterations(candles: BotCandles) {
	let symbol = Object.keys(candles)[0];
	return candles[symbol].length - 200;
}

function getBTPortfolio({initialBalances}: BacktestConfig ){
	let portfolio: Portfolio = {};
	Object.keys( initialBalances ).forEach( asset => {
		portfolio[asset] = {
			asset,
			free: initialBalances[asset],
			total: initialBalances[asset]
		};
	});
	return portfolio;
}

function getIterationCandles( allCandles: BotCandles, iteration: number ) {
	let iterationCandles: BotCandles = {};
	for(let asset in allCandles ){
		iterationCandles[ asset ] = allCandles[asset].slice(iteration, iteration + 200);
	}
	return iterationCandles;
}

function getAdapter(iterationCandles: BotCandles, portfolio: Portfolio, orders: Orders, openOrderIds: string[] ) {
	// Create the empty adapter and set the attributes manually
	let adapter = new VirtualAdapter({
		key: '{}',
		secret: '{}'
	});

	adapter.orders = orders;
	adapter.openOrders = openOrderIds;
	adapter.portfolio = portfolio;

	// Set the last dates
	for( let asset in iterationCandles ){
		adapter.lastCandles[asset] = candles.getLast(iterationCandles[asset]);
		if( adapter.lastDate === -1 ){
			adapter.lastDate = candles.getTime(candles.getLast(iterationCandles[asset]));
		}
	}

	return adapter;
}

let workerSource: string;
function getWorkerSource(): Promise<string> {
	if( workerSource ){
		return Promise.resolve(workerSource);
	}

	return fetch('/wwph.js')
		.then( res => res.text() )
		.then( source => {
			workerSource = source;
			return source;
		})
	;
}