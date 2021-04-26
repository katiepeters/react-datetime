import { ArrayCandle } from '../../lambda.types';
import { DataFetcher } from './adapters/adapterTypes';
import bitfinexAdapter from './adapters/bitfinexDataAdapter';

interface ExchangeDataFetcherInput {
	exchange: string
	market: string
	runInterval: '5m' | '10m' | '30m' | '1h' | '4h' | '1d'
	lastCandleAt?: number
	candleCount?: number
}

const fetcher = {
	async getData(config: ExchangeDataFetcherInput): Promise<ArrayCandle[]> {
		const adapter = getAdapter( config.exchange );
		if( !adapter ) return [];

		console.log('fetching market data');
		return adapter.fetch({
			...config,
			lastCandleAt: getLastCandleAt(config.runInterval, config.lastCandleAt || Date.now()),
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

const runIntervalTime = {
	'5m': 5 * 60 * 1000,
	'10m': 10 * 60 * 1000,
	'30m': 30 * 60 * 1000,
	'1h': 60 * 60 * 1000,
	'4h': 4 * 60 * 60 * 1000,
	'1d': 24 * 60 * 60 * 1000
};

function getLastCandleAt( runInterval: string, lastCandleAt: number ) : number {
	let rest = lastCandleAt % runIntervalTime[runInterval];
	return lastCandleAt - rest;
}


export default fetcher;