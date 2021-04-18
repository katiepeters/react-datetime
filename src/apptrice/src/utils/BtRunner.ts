import { BotCandles, BotState, Orders, Portfolio } from "../../../lambdas/lambda.types";
import VirtualAdapter from "../../../lambdas/_common/exchanges/adapters/VirtualAdapter";
import candles from "../../../lambdas/_common/utils/candles";
import { BotWorker, createBot } from "../screens/botEditor/backtesting/botWorker";
import { BacktestConfig } from "../screens/botEditor/tools/BotTools";
import apiCacher from "../state/apiCacher";
import store from "../state/store"
import {v4 as uuid} from 'uuid';

let runningBot: BotWorker;
const BtRunner = {
	start( botData: any, options: BacktestConfig ): string{
		const btid = createRun( botData.botId );

		prepareAndRun( botData, options );

		return btid;
	},

	abort(){
		if (store.currentBackTesting.status === 'running') {
			updateBtStore({ status: 'aborted' });
			runningBot.terminate();
		}
	}
}

export default BtRunner;


async function getAllCandles(symbols: string[], interval: string, startDate: number, endDate: number) {
	let start = add200Candles(startDate, interval);

	let promises = symbols.map(symbol => apiCacher.getCandles({
		symbol,
		interval,
		startDate: start,
		endDate
	}));

	let candleArr = await Promise.all(promises);
	let candles: BotCandles = {};
	candleArr.forEach((res, i) => candles[symbols[i]] = res.data);
	return candles;
}

async function prepareAndRun(botData: any, options: BacktestConfig){
	let bot = await prepareBot(botData.source);
	if (!bot) {
		console.log('ERROR creating bot');
		return;
	}

	updateBtStore({ status: 'candles'});

	runningBot = bot;

	let symbols = getSymbols(options.baseAssets, options.quotedAsset);
	let candles = await getAllCandles(symbols, options.interval, options.startDate, options.endDate);

	let {state, logs} = await bot.initialize({
		// @ts-ignore
		symbols, interval: options.interval, exchange: 'bitfinex'
	})
	
	updateBtStore({
		status: 'running',
		logs,
		candles
	});

	await runIterations(bot, state, { symbols, candles, options });
	if (store.currentBackTesting.status !== 'error') {
		updateBtStore({ status: 'completed' });
	}
	runningBot.terminate();
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

async function prepareBot( botSource: string ): Promise<BotWorker|null> {
	const botWorkerSource = await getWorkerSource();
	if( !botWorkerSource ) return null;
	return createBot( botSource, botWorkerSource );
}

let workerSource: string;
function getWorkerSource(): Promise<string> {
	if (workerSource) {
		return Promise.resolve(workerSource);
	}

	return fetch('/wwph.js')
		.then(res => res.text())
		.then(source => {
			workerSource = source;
			return source;
		})
	;
}

function getSymbols(baseAssets: string[], quotedAsset: string): string[] {
	return baseAssets.map(base => `${base}/${quotedAsset}`);
}

function createRun( botId: any ): string{
	let btid = uuid();
	store.currentBackTesting = {
		id: btid,
		botId: botId,
		status: 'init',
		iteration: 0,
		totalIterations: 0,
		orders: {},
		balances: []
	};
	return btid;
}

function updateBtStore( update: any ){
	store.currentBackTesting = {
		...store.currentBackTesting,
		...update
	};
}

interface IterationData {
	symbols: string[],
	candles: BotCandles,
	options: BacktestConfig
}

async function runIterations(bot: BotWorker, state: BotState, { symbols, candles, options }: IterationData ) {
	const totalIterations = getTotalIterations(candles);
	let portfolio = createPortfolio(options);
	let orders = {};
	let openOrderIds: string[] = [];
	let iteration = 0;

	while (isRunning() && iteration < totalIterations) {
		console.log(`Iteration ${iteration} out of ${totalIterations}`);
		let iterationCandles = getIterationCandles(candles, iteration);

		let adapter = getAdapter(iterationCandles, portfolio, orders, openOrderIds);
		adapter.updateOpenOrders();
		orders = adapter.orders;
		openOrderIds = adapter.openOrders;

		let results;
		try {
			results = await bot.execute({
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
		}
		catch( error ) {
			setBtError(error);
		}

		if( !results ) return;

		state = results.state;
		if (results.ordersToCancel.length > 0) {
			adapter.cancelOrders(results.ordersToCancel);
		}
		if (results.ordersToPlace.length > 0) {
			adapter.placeOrders(results.ordersToPlace);
		}

		portfolio = adapter.portfolio;
		orders = adapter.orders;
		openOrderIds = adapter.openOrders;

		iteration++;
		
		updateBtStore({
			iteration,
			orders,
			balances: [...store.currentBackTesting.balances, {...portfolio}],
			candles: getGraphCandles(candles),
			logs: [ ...store.currentBackTesting.logs, ...results.logs]
		});

		console.log(Object.keys(orders).length);
	}

	console.log('Portfolio', portfolio);
}

function isRunning() {
	return store.currentBackTesting?.status === 'running' || false;
}

function createPortfolio({ initialBalances }: BacktestConfig) {
	let portfolio: Portfolio = {};
	Object.keys(initialBalances).forEach(asset => {
		portfolio[asset] = {
			asset,
			free: initialBalances[asset],
			total: initialBalances[asset]
		};
	});
	return portfolio;
}

function getTotalIterations(candles: BotCandles) {
	let symbol = Object.keys(candles)[0];
	return candles[symbol].length - 200;
}

function getIterationCandles(allCandles: BotCandles, iteration: number) {
	let iterationCandles: BotCandles = {};
	for (let asset in allCandles) {
		iterationCandles[asset] = allCandles[asset].slice(iteration, iteration + 200);
	}
	return iterationCandles;
}


function getAdapter(iterationCandles: BotCandles, portfolio: Portfolio, orders: Orders, openOrderIds: string[]) {
	// Create the empty adapter and set the attributes manually
	let adapter = new VirtualAdapter({
		key: '{}',
		secret: '{}'
	});

	adapter.orders = orders;
	adapter.openOrders = openOrderIds;
	adapter.portfolio = portfolio;

	// Set the last dates
	for (let asset in iterationCandles) {
		adapter.lastCandles[asset] = candles.getLast(iterationCandles[asset]);
		if (adapter.lastDate === -1) {
			adapter.lastDate = candles.getTime(candles.getLast(iterationCandles[asset]));
		}
	}

	return adapter;
}


function getGraphCandles( candles: BotCandles ){
	const graphCandles: any = {};
	for( let asset in candles ){
		graphCandles[asset] = candles[asset].slice(200);
	}
	return graphCandles;
}

function setBtError( error: any ){
	store.currentBackTesting.logs.push({
		type: 'error',
		date: Date.now(),
		message: error.message || error.toString()
	});

	updateBtStore({
		status: 'error'
	});
}