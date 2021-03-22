import { DataFetcher, DataFetcherInput } from "./adapterTypes";

const fetch = require('node-fetch');
const baseUrl = 'https://api-pub.bitfinex.com/v2';

let cache = {};

type ArrayCandle = [
	number, number, number, number, number, number
]

const dataAdapter: DataFetcher = {
	async fetch(input: DataFetcherInput): Promise<ArrayCandle[]> {
		const queryKey = getKey(input);
		let candles = cache[queryKey];
		if( candles ){
			return candles;
		}
		const exchangeSegment = getExchangeSegment(input.market);
		const pathParams = `candles/trade:${input.interval}:${exchangeSegment}/hist`;
		const queryParams = `limit=${input.candleCount}&end=${input.lastCandleAt}`;
		
		console.log(`Request ${baseUrl}/${pathParams}?${queryParams}`);
		const req = await fetch(`${baseUrl}/${pathParams}?${queryParams}`);
		const reversedCandles = await req.json();

		candles = reversedCandles.reverse();
		cache[ queryKey ] = candles;

		return candles;
	}
}

function getKey( input: DataFetcherInput ): string {
	return `${input.market}:${input.interval}:${input.lastCandleAt}:${input.candleCount}`;
}


function getExchangeSegment( market ){
	return `t${market.replace('/', '')}`;
}

export default dataAdapter;