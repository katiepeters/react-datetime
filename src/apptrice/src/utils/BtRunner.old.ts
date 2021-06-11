import { BotCandles, BotState, Orders, Portfolio } from "../../../lambdas/lambda.types";
import VirtualAdapter from "../../../lambdas/_common/exchanges/adapters/VirtualAdapter";
import candles from "../../../lambdas/_common/utils/candles";
import { BotWorker, createBot } from "../screens/botEditor/backtesting/botWorker";
import { BacktestConfig } from "../screens/botEditor/tools/BotTools";
import apiCacher from "../state/apiCacher";
import store from "../state/store"
import {v4 as uuid} from 'uuid';
import quickStore from "../state/quickStore";

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


async function getAllCandles(symbols: string[], runInterval: string, startDate: number, endDate: number) {
	let start = add200Candles(startDate, runInterval);

	let promises = symbols.map(symbol => apiCacher.getCandles({
		symbol,
		runInterval,
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
	let candles = await getAllCandles(symbols, options.runInterval, options.startDate, options.endDate);

	/*
	let {state, logs} = await bot.initialize({
		// @ts-ignore
		symbols, runInterval: options.runInterval, exchange: 'bitfinex'
	});

	quickStore.setCandles(candles);
	quickStore.setLogs(logs);
	
	updateBtStore({
		status: 'running'
	});

	await runIterations(bot, state, { symbols, candles, options });
	if (store.currentBackTesting.status !== 'error') {
		updateBtStore({ status: 'completed' });
	}
	runningBot.terminate();
	*/
}


const runIntervalTime = {
	'5m': 5 * 60 * 1000,
	'10m': 10 * 60 * 1000,
	'30m': 30 * 60 * 1000,
	'1h': 60 * 60 * 1000,
	'4h': 4 * 60 * 60 * 1000,
	'1d': 24 * 60 * 60 * 1000
};
function add200Candles(start: number, runInterval: string) {
	// @ts-ignore
	return start - (runIntervalTime[runInterval] * 200);
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

	// Orders and logs live in the quickstore for performance
	quickStore.setOrders({});
	quickStore.setLogs([]);

	while (isRunning() && iteration < totalIterations) {
		console.log(`Iteration ${iteration} out of ${totalIterations}`);
		let iterationCandles = getIterationCandles(candles, iteration);

		let adapter = getAdapter(iterationCandles, portfolio, orders, openOrderIds);
		adapter.updateOpenOrders();
		orders = adapter.orders;
		openOrderIds = adapter.openOrders;

		/*
		let results;
		try {
			results = await bot.execute({
				portfolio,
				orders: {items: adapter.orders},
				openOrders: openOrderIds,
				state,
				candles: iterationCandles,
				config: {
					symbols,
					runInterval: options.runInterval,
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

		quickStore.setOrders(orders);
		quickStore.appendLogs(results.logs);
		
		updateBtStore({
			iteration,
			balances: [...store.currentBackTesting.balances, {...portfolio}]
		});

		console.log(Object.keys(orders).length);
		*/
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
	// @ts-ignore
	let adapter = new VirtualAdapter({});

	adapter.orders = orders;
	adapter.openOrders = openOrderIds;
	adapter.portfolio = portfolio;

	// Set the last dates
	for (let asset in iterationCandles) {
		adapter.lastCandles[asset] = candles.getLast(iterationCandles[asset]);
		if (adapter.lastDate === -1) {
			adapter.lastDate = candles.getTime(candles.getLast(iterationCandles[asset]));

			// The orders will be placed a bit later than the candle date,
			// to see how the limit orders are placed and executed
			let previousDate = candles.getTime(iterationCandles[asset].slice(-2)[0]);
			adapter.placeDate = adapter.lastDate + ((adapter.lastDate - previousDate) / 2);
		}
	}

	return adapter;
}

function setBtError( error: any ){
	quickStore.appendLogs([{
		id: -1,
		type: 'error',
		date: Date.now(),
		message: error.message || error.toString()
	}]);

	updateBtStore({
		status: 'error'
	});
}