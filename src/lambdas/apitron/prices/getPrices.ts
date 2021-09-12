import { ArrayCandle } from "../../lambda.types";
import BitfinexAdapter from "../../_common/exchanges/adapters/BitfinexAdapter";
import { CandleInterval, ExchangeAdapter } from "../../_common/exchanges/ExchangeAdapter";
import candles from "../../_common/utils/candles";
import s3Helper from "../../_common/utils/s3";
import tickerTimer from "../../_common/utils/tickerTimer";
import { QueryContextInput, QueryHandler, ContextResult, QueryResponseInput, ResponseResult } from "../apitron.types";
import { validateShape } from "../utils/validators";

const getPrices: QueryHandler = {
	name: 'getSingleDeployment',
	async getContext({ query }: QueryContextInput): Promise<ContextResult> {
		const {error} = validateShape(query, {
			exchange: 'string',
			type: 'pricesType'
		});

		const {exchange, type} = query;
		let pair = query.pair.replace('_', '/');

		console.log(error);
		if (error) return { error: { ...error, code: 'invalid_request' } };

		let adapter = getAdapter( exchange );
		if( !adapter ) return { error: {code: 'unknown_exchange'} };

		let cached = await getCached( exchange, pair, type );
		if( isCacheExpired( cached, type ) ){
			let prices = await getExchangePrices( adapter, pair, type );
			cached = await updateCache( exchange, pair, type, prices, cached );
		}

		return { context: {prices: cached.prices}};
	},

	getResponse({ params, context }: QueryResponseInput): ResponseResult {
		return {status: 200, data: context.prices};
	}
}

export default getPrices;


const adapters = {
	bitfinex: BitfinexAdapter
}
function getAdapter( exchange: string ): ExchangeAdapter | undefined {
	let Adapter = adapters[exchange];
	if( Adapter ){
		return new Adapter({});
	}
}

function getCachePath( exchange: string, pair: string, type: PriceType ){
	return `${exchange}/p/${pair.replace('/', '_')}-${type[0]}}`;
}

async function getCached( exchange: string, pair: string, type: PriceType ){
	let path = getCachePath( exchange, pair, type );
	let cached = await s3Helper.exchanges.getContent( path );
	console.log('Cached', cached);
	if( cached ){
		return JSON.parse( cached );
	}
}

type PriceType = 'hourly' | 'daily' | 'weekly' | 'monthly';

interface ExchangePrices {
	[timestamp: number]: number
}

interface ExchangePriceCache {
	lastUpdatedAt: number,
	prices: ExchangePrices
}

function isCacheExpired( cache: ExchangePriceCache | undefined, type: PriceType ) {
	if( !cache ) return true;

	const last = new Date( cache.lastUpdatedAt );
	const now = new Date();

	return (
		type === 'hourly' && last.getUTCHours() !== now.getUTCHours() ||
		type === 'daily' && last.getUTCDate() !== now.getUTCDate() ||
		type === 'weekly' && last.getUTCDay() === 6 && now.getUTCDay() === 0 ||
		type === 'monthly' && last.getUTCMonth() !== now.getMonth()
	);
}

const typeIntervals: {[type:string]: CandleInterval} = {
	'hourly': '1h',
	'daily': '1d',
	'weekly': '1w',
	'monthly': '1mo',
};

async function getExchangePrices( adapter: ExchangeAdapter, pair: string, type: PriceType ): Promise<ExchangePriceCache> {
	const options = {
		market: pair,
		runInterval: typeIntervals[type],
		lastCandleAt: Date.now(),
		candleCount: type === 'monthly' ? 1000 : 100
	};

	const cs = await adapter.getCandles( options );
	let prices: ExchangePrices = {};
	cs.forEach( (candle: ArrayCandle) => {
		prices[ getTypeTimestamp(candles.getTime(candle), type)  ] = candles.getClose(candle);
	});

	let [lastCandle] = cs.slice(-1);
	return {
		lastUpdatedAt: getTypeTimestamp(candles.getTime(lastCandle), type),
		prices
	};
}

function getTypeTimestamp( original: number, type: PriceType ){
	switch( type ){
		case 'hourly':
			return tickerTimer.getHourlyTime( original );
		case 'daily':
			return tickerTimer.getDailyTime( original );
		case 'weekly':
			return tickerTimer.getWeeklyTime( original );	
	}

	return tickerTimer.getMonthlyTime( original );
}


async function updateCache(exchange: string, pair: string, type: PriceType, data: ExchangePriceCache, cached: ExchangePriceCache | undefined ): Promise<ExchangePriceCache> {
	const path = getCachePath( exchange, pair, type);
	const content: ExchangePriceCache = {
		lastUpdatedAt: data.lastUpdatedAt,
		prices: cached && type === 'monthly' ?
			{ ...cached.prices, ...data.prices } :
			data.prices
	}
	const meta = {
		CacheControl: 'max-age=300',
		ContentType: 'application/json',
		ACL: 'public-read'
	}

	await s3Helper.exchanges.setContent(
		path, JSON.stringify(content), meta
	);

	return content;
}