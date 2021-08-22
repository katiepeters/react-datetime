import DataLoader, { DataLoaderConfig } from "../../utils/DataLoader";
import apiClient from "../apiClient";

export type PriceSeriesType = 'hourly' | 'daily' | 'weekly' | 'monthly';

export type PriceTypeHistory = {
	[timestamp: number]: number
};

export type PriceSymbolHistory = {
	hourly?: PriceTypeHistory,
	daily?: PriceTypeHistory,
	weekly?: PriceTypeHistory,
	monthly?: PriceTypeHistory,
};

export type SymbolPromises = {
	[key: string]: Promise<any>
}

const priceHistory: {
	[exchange: string]: {
		[symbol: string]: PriceSymbolHistory
	} 
} = {};

const symbolPromises: SymbolPromises = {};

const config: DataLoaderConfig<PriceTypeHistory> = {
	getFromCache(exchange: string, symbol: string, type: PriceSeriesType ): PriceTypeHistory | undefined {
		return (priceHistory[exchange] &&
			priceHistory[exchange][symbol] &&
			priceHistory[exchange][symbol][type]) ||
			undefined
		;
	},
	loadData( exchange: string, symbol: string, type: PriceSeriesType ) {
		let promiseKey = getKey(exchange, symbol, type );
		let promise = symbolPromises[ promiseKey ];
		if( promise ) return promise;

		symbolPromises[ promiseKey ] = apiClient.loadPrices(exchange, symbol, type)
			.then( res => {
				let history = priceHistory[exchange] || {};
				priceHistory[exchange] = {
					...history,
					[symbol]: {
						...(history[symbol] || {} ),
						[type]: res.data
					}
				};
				delete symbolPromises[ promiseKey ];
			})
		;

		return symbolPromises[ promiseKey ];
	}
}

function getKey( exchange: string, symbol: string, type: string ){
	return `${exchange}_${symbol}_${type}`;
}


export default new DataLoader<PriceTypeHistory>(config);