/* eslint-disable no-restricted-globals */
import Trader from '../../../../../lambdas/executor/Trader';
import botUtils from '../../../../../lambdas/_common/utils/botUtils';

// WARNING: This line will be replaced by the bot source code. DO NOT UPDATE
console.log("#BOT");

self.onmessage = function (msg: any ){
	let settings = msg.data;
	const trader = new Trader( settings.portfolio, settings.orders );
	let state = {...settings.state};
	// @ts-ignore
	bot.onData({
		candles: settings.candles,
		config: settings.config,
		trader,
		state,
		utils: botUtils
	});

	// @ts-ignore
	self.postMessage({
		ordersToCancel: trader.ordersToCancel,
		ordersToPlace: trader.ordersToPlace,
		state: state
	});
}


export default function mock() {
	// This is needed just to not have rogue files
}