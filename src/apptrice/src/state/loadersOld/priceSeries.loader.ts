import DataLoader, { DataLoaderConfig } from "../../utils/DataLoader";
import apiClient from "../apiClient";

export type PriceSeriesType = 'hourly' | 'daily' | 'weekly' | 'monthly';

export type PriceTypeHistory = {
	[timestamp: number]: number
};

export type PricePairHistory = {
	hourly?: PriceTypeHistory,
	daily?: PriceTypeHistory,
	weekly?: PriceTypeHistory,
	monthly?: PriceTypeHistory,
};

export type PairPromises = {
	[key: string]: Promise<any>
}

const priceHistory: {
	[exchange: string]: {
		[pair: string]: PricePairHistory
	} 
} = {};

const pairPromises: PairPromises = {};

const config: DataLoaderConfig<PriceTypeHistory> = {
	getFromCache(exchange: string, pair: string, type: PriceSeriesType ): PriceTypeHistory | undefined {
		return (priceHistory[exchange] &&
			priceHistory[exchange][pair] &&
			priceHistory[exchange][pair][type]) ||
			undefined
		;
	},
	loadData( exchange: string, pair: string, type: PriceSeriesType ) {
		let promiseKey = getKey(exchange, pair, type );
		let promise = pairPromises[ promiseKey ];
		if( promise ) return promise;

		pairPromises[ promiseKey ] = apiClient.loadPrices(exchange, pair, type)
			.then( res => {
				let history = priceHistory[exchange] || {};
				priceHistory[exchange] = {
					...history,
					[pair]: {
						...(history[pair] || {} ),
						[type]: res.data
					}
				};
				delete pairPromises[ promiseKey ];
			})
		;

		return pairPromises[ promiseKey ];
	}
}

function getKey( exchange: string, pair: string, type: string ){
	return `${exchange}_${pair}_${type}`;
}


export default new DataLoader<PriceTypeHistory>(config);