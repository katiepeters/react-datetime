import { TradeBot, BotInput } from "../TradeBot";

export default class TestBot extends TradeBot {
	hello( name: string) {
		return getHello( name );
	}
	onData({ config, state, trader, candles, utils }: BotInput ) {
		config.symbols.forEach( symbol => {
			// Limit order
			if( state[symbol] ){
				let order = trader.getOrder(state[symbol]);
				console.log('Order found!', order);
				if (order && order.status === 'placed') {
					console.log('ADding to delete', state[symbol]);
					trader.cancelOrder(state[symbol]);
				}
				delete state[symbol];
			}
			else {
				const { getClose, getLast } = utils.candles;
				const currentPrice = getClose(getLast(candles[symbol]));

				let order = trader.placeOrder({
					type: 'limit',
					direction: 'buy',
					price: currentPrice * .8,
					symbol,
					amount: 0.00035
				});
				state[symbol] = order.id;
			}
		});

		// Market order
		if( !state.marketOrder ){
			let order = trader.placeOrder({
				type: 'market',
				direction: 'buy',
				symbol: 'ETH/USD',
				amount: 0.016
			});
			state.marketOrder = order.id;
		}
		else {
			let portfolio = trader.getPortfolio();
			let amount = portfolio.ETH.free;
			trader.placeOrder({
				type: 'market',
				direction: 'sell',
				symbol: 'ETH/USD',
				amount
			});
			delete state.marketOrder;
		}
	}
}


function getHello( name ){
	return `Hola ${name}`;
}