import { DataFetcher } from './adapters/adapterTypes';
import bitfinexAdapter from './adapters/bitfinexDataAdapter';

interface ExchangeDataFetcherInput {
	exchange: string
	market: string
	interval: '5m' | '10m' | '30m' | '1h' | '4h' | '1d'
	lastCandleAt?: number
	candleCount?: number
}

type ArrayCandle = [
	number, number, number, number, number, number
]

const fetcher = {
	async getData(config: ExchangeDataFetcherInput): Promise<ArrayCandle[]> {
		const adapter = getAdapter( config.exchange );
		if( !adapter ) return [];

		console.log('fetching market data');
		return adapter.fetch({
			...config,
			lastCandleAt: getLastCandleAt(config.interval, config.lastCandleAt || Date.now()),
			candleCount: config.candleCount || 200
		});
	}
}

function getAdapter(exchange): DataFetcher | void {
	switch(exchange) {
		case 'bitfinex':
			return bitfinexAdapter;
		default:
			console.error(`Unknown data adapter for exchange ${exchange}` );
	}
}

const intervalTime = {
	'5m': 5 * 60 * 1000,
	'10m': 10 * 60 * 1000,
	'30m': 30 * 60 * 1000,
	'1h': 60 * 60 * 1000,
	'4h': 4 * 60 * 60 * 1000,
	'1d': 24 * 60 * 60 * 1000
};

function getLastCandleAt( interval: string, lastCandleAt: number ) : number {
	let rest = lastCandleAt % intervalTime[interval];
	return lastCandleAt - rest;
}


export default fetcher;