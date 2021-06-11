/* eslint-disable no-restricted-globals */
import Trader from '../../../../../lambdas/executor/Trader';
import cons from '../../../../../lambdas/executor/Consoler';
import botUtils from '../../../../../lambdas/_common/utils/botUtils';

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
	
	const trader = new Trader(input.portfolio, input.orders, input.candles);

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


export default function mock() {
	// This is needed just to not have rogue files
}