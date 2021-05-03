import Emitter from 'eventemitter3';
import { ConsoleEntry } from '../../../lambdas/executor/Consoler';
import { BotCandles, Orders } from '../../../lambdas/lambda.types';

let emitter = new Emitter();
let orders: Orders = {};
let logs: ConsoleEntry[] = [];
let changeTimer:any = false;
let candles: BotCandles = {};

const quickStore = {
	addChangeListener( clbk: () => void ){
		return emitter.on('change', clbk);
	},
	removeChangeListener( clbk: () => void  ){
		return emitter.off('change', clbk);
	},
	emitChange() {
		if( changeTimer ) return;
		changeTimer = setTimeout( () => {
			changeTimer = false;
			emitter.emit('change');
		});
	},

	getOrders(): Orders {
		return orders;
	},

	setOrders( nextOrders: Orders ){
		orders = { ...nextOrders};
		this.emitChange();
	},

	appendOrders( nextOrders: Orders ){
		orders = {
			...orders,
			...nextOrders
		};
		this.emitChange();
	},

	getLogs() {
		return logs;
	},

	setLogs( nextLogs: ConsoleEntry[] ){
		logs = [...nextLogs];
		this.emitChange();
	},

	appendLogs( nextLogs: ConsoleEntry[]){
		logs = [...logs, ...nextLogs];
		this.emitChange();
	},

	setCandles( btCandles: BotCandles ){
		candles = btCandles;
		this.emitChange();
	},

	getCandles(){
		return candles;
	}
}

export default quickStore;