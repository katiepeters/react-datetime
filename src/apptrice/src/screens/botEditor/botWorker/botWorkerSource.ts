/* eslint-disable no-restricted-globals */
import Trader from '../../../../../lambdas/executor/Trader';
import cons from '../../../../../lambdas/executor/Consoler';
import botUtils from '../../../../../lambdas/_common/utils/botUtils';

// WARNING: This line will be replaced by the bot source code. DO NOT UPDATE
console.log("#BOT");

self.onmessage = function (msg: any ){
	let {action, input} = msg.data;

	if (action === 'init') {
		let state = {};

		const originalConsole = console;
		// @ts-ignore
		console = cons;

		// @ts-ignore
		initializeState(input, state);
		// @ts-ignore
		self.postMessage({
			state: state || {},
			logs: cons.getEntries()
		});

		cons.clear();
		console = originalConsole;
	}
	else {
		const trader = new Trader(input.portfolio, input.orders, input.candles);

		const originalConsole = console;
		// @ts-ignore
		console = cons;

		let state = { ...input.state };

		// @ts-ignore
		onData({
			candles: input.candles,
			config: input.config,
			trader,
			state,
			utils: botUtils
		});

		// @ts-ignore
		self.postMessage({
			ordersToCancel: trader.ordersToCancel,
			ordersToPlace: trader.ordersToPlace,
			state: state,
			logs: cons.getEntries()
		});

		cons.clear();
		console = originalConsole;
	}
}

export default function mock() {
	// This is needed just to not have rogue files
}