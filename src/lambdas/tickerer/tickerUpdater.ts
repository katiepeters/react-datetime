import BitfinexAdapter from "../_common/exchanges/adapters/BitfinexAdapter";


interface TickerUpdaterInput {
	exchange: string
};


export async function tickerUpdater({exchange}: TickerUpdaterInput) {
	let Adapter = exchanges[exchange];

	if( !Adapter ){
		return {error: `Unknown exchange ${exchange}`};
	}

	let adapter = new Adapter({});

	const now = Date.now();
	const [ticker, symbols] = await Promise.all([
		adapter.getTicker(),
		adapter.getSymbols()
	]);

	console.log( ticker, symbols );

	
	/*
	let promises = [
		updateTicker(exchange, ticker),
		updateSymbols(exchange, symbols)
	];

	if( tickerTimer.isHourlyTicker(now) ){
		promises.push( updateHourly( exchange, ticker, now ) );
	}

	if( tickerTimer.isDailyTicker(now) ){
		promises.push( updateDaily( exchange, ticker, now ) );
	}

	if( tickerTimer.isTendaysTicker(now) ){
		promises.push( update( exchange, ticker, now ) );
	}

	let results = await Promise.all(promises);
	console.log( results );
	*/
	return {error: false};
}


const exchanges = {
	bitfinex: BitfinexAdapter
}