import { TradeBot, BotInput } from "../TradeBot";

export default class TestBot extends TradeBot {
	hello( name: string) {
		return getHello( name );
	}
	onData({ config, state, trader, candles, utils }: BotInput ) {
		config.symbols.forEach( symbol => {
			if( state[symbol] ){
				trader.cancelOrder( state[symbol] );
			}

			const {getClose, getLast} = utils.candles;
			const currentPrice = getClose( getLast(candles[symbol]) );

			trader.placeOrder({
				type: 'limit',
				direction: 'buy',
				price: currentPrice * 1.2,
				symbol,
				amount: 100
			});
		})
	}
}


function getHello( name ){
	return `Hola ${name}`;
}