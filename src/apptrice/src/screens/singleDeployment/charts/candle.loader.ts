import { ArrayCandle, BotCandles } from "../../../../../lambdas/lambda.types";
import apiCacher from "../../../state/apiCacher";
import DataLoader, { DataLoaderConfig } from "../../../utils/DataLoader";

let candleCacheKey = '';
let candleCache: ArrayCandle[] = [];

const config: DataLoaderConfig<ArrayCandle[]> = {
	getFromCache( exchange: string, symbol:string, runInterval: string, startDate: string, endDate: string ){
		let key = getKey( exchange, symbol, runInterval, startDate, endDate );
		console.log( key );
		if( key === candleCacheKey ){
			return candleCache;
		}
	},

	loadData(exchange: string, symbol: string, runInterval: string, startDate: string, endDate: string ){
		return apiCacher.getCandles({ symbol, runInterval, startDate: parseInt(startDate), endDate: parseInt(endDate) })
			.then( res => {
				let key = getKey(exchange, symbol, runInterval, startDate, endDate);
				candleCacheKey = key;
				candleCache = res.data;
				return candleCache;
			})
		;
	}
}

export default new DataLoader<ArrayCandle[]>(config);


function getKey(exchange: string, symbol: string, runInterval: string, startDate: string, endDate: string) {
	return `${exchange}_${symbol}_${runInterval}_${startDate}_${endDate}`;
}