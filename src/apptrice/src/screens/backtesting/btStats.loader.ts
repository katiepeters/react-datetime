import DataLoader from "../../utils/DataLoader";
import store from "../../state/store";
import { ArrayCandle, BotCandles, Orders } from "../../../../lambdas/lambda.types";
import quickStore from "../../state/quickStore";
const WorkerFunction = require('worker-function');

let cache: {[id:string]: any} = {};

const btStatsLoader = new DataLoader({
	loadData(id: string) {
		let bt = store.currentBackTesting;
		if( !bt || bt.status !== 'completed') {
			return Promise.reject({error: 'bt_not_ready'});
		}

		return calculateStats(quickStore.getOrders(), bt.candles.flatten())
			.then( (stats:any) => {
				cache[id] = stats;
			})
		;
	},
	getFromCache(id: string) {
		return cache[id];
	}
});

export default btStatsLoader;


const calculateStats = WorkerFunction( (orders: Orders, candles: BotCandles, done: (result:any) => void) => {
	let volumes: {[symbol:string]: {x: Date, y: number}[]} = {};
	let chartCandles: {[symbol:string]: {x: Date, y: number[]}[]} = {};

	for(let symbol in candles ){
		let v: { x: Date, y: number }[] = [];
		let ca: { x: Date, y: number[] }[] = [];
		candles[symbol].forEach((c: ArrayCandle) => {
			v.push({
				x: new Date(c[0]),
				y: c[5]
			});
			ca.push({
				x: new Date(c[0]),
				y: [c[1], c[3], c[4], c[2]]
			});
		});
		volumes[symbol] = v;
		chartCandles[symbol] = ca;
	}
	
	done({
		candles: chartCandles,
		volumes
	});
});