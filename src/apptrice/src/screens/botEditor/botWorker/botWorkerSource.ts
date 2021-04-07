/* eslint-disable no-restricted-globals */
import Trader from '../../../../../lambdas/executor/Trader';
import botUtils from '../../../../../lambdas/_common/utils/botUtils';

const Bot: any = '#BOT#';
const bot = new Bot();

self.onmessage = function (msg: any ){
	let settings = msg.data;
	const trader = new Trader( settings.portfolio, settings.orders );
	let state = {...settings.state};
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