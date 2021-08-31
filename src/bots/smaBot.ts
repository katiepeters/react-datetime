
function initializeState( config, state ){
    state.currentBuy = undefined;
}

function onData( input: BotInput) {
    const {candleData, state, indicators, config, utils, trader,plotter} = input;

    const pair = config.pairs[0];
    const {quoted, base} = utils.getPairAssets(pair);

    const sma14 = indicators.sma(candleData[pair], 14);
    const sma50 = indicators.sma(candleData[pair], 50);
    const [isCrossover] = utils.isCrossOver( sma14, sma50 ).slice(-1);
    const [isCrossunder] = utils.isCrossUnder( sma14, sma50 ).slice(-1);

    const [pprev, prevCandle, lastCandle] = utils.getCandles(candleData[pair].slice(-3));
    if( pprev.high < prevCandle.high && prevCandle.high >lastCandle.high ){
        plotter.plotPoint('tops', prevCandle.high );
    }
    if( pprev.low > prevCandle.low && prevCandle.low < lastCandle.low ){
        plotter.plotPoint('bottoms', prevCandle.low );
    }


    if( !state.currentBuy && isCrossover ){
        state.currentBuy = trader.placeOrder({
            pair,
            type: 'market',
            direction: 'buy',
            amount: trader.getBalance( quoted ).free / trader.getPrice( pair )
        });
    }
    else if( state.currentBuy && isCrossunder ){
        trader.placeOrder({
            pair,
            type: 'market',
            direction: 'sell',
            amount: trader.getBalance( base ).free
        });
        state.currentBuy = undefined;
    }
}
