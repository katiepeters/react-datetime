import BitfinexAdapter from "../_common/exchanges/adapters/BitfinexAdapter";
import { ExchangePairs, Ticker } from "../_common/exchanges/ExchangeAdapter";
import s3Helper from "../_common/utils/s3";


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
	const [ticker, pairs] = await Promise.all([
		adapter.getTicker(),
		adapter.getPairs()
	]);
	
	let promises = [
		updateTicker(exchange, ticker),
		updatePairs(exchange, pairs)
	];

	/*

	if( tickerTimer.isHourlyTicker(now) ){
		promises.push( updateHourly( exchange, ticker, now ) );
	}

	if( tickerTimer.isDailyTicker(now) ){
		promises.push( updateDaily( exchange, ticker, now ) );
	}

	if( tickerTimer.isTendaysTicker(now) ){
		promises.push( update( exchange, ticker, now ) );
	}

	*/
	let results = await Promise.all(promises);
	console.log( results );
	return {error: false};
}


const exchanges = {
	bitfinex: BitfinexAdapter
}

const EXCHANGE_PATH = 'exchanges';
const meta = {
	CacheControl: 'max-age=300',
	ContentType: 'application/json',
  ACL: 'public-read'
}
function updateTicker( exchange: string, ticker: Ticker ){
	const path = `${EXCHANGE_PATH}/${exchange.toLowerCase()}/ticker`;
	return s3Helper.exchanges.setContent( path, JSON.stringify(ticker), meta );
}

function updatePairs( exchange: string, pairs: ExchangePairs ){
	const path = `${EXCHANGE_PATH}/${exchange.toLowerCase()}/pairs`;
	return s3Helper.exchanges.setContent( path, JSON.stringify(pairs), meta );
}