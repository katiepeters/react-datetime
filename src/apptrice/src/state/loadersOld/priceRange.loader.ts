import tickerTimer from "../../../../lambdas/_common/utils/tickerTimer";
import DataLoader, { DataLoaderConfig } from "../../utils/DataLoader";
import historicalPriceLoader from "./historicalPrice.loader";
import priceSeriesLoader from "./priceSeries.loader";

const config: DataLoaderConfig<[number,number]> = {
	getFromCache(exchange: string, symbol: string, startDate: number, endDate: number ): [number, number] | undefined {
		let types = getRangeTypes( startDate, endDate );
		let i = types.length;
		while( i-- > 0 ){
			const {isLoading} = priceSeriesLoader.getData(exchange, symbol, types[i]);
			if( isLoading ) return;
		}

		let {data:startPrice} = historicalPriceLoader.getData( exchange, symbol, startDate );
		let {data:endPrice} = historicalPriceLoader.getData( exchange, symbol, endDate );

		return [
			startPrice, endPrice
		];
	},
	loadData( exchange: string, symbol: string, startDate: number, endDate: number ) {
		let promises = getRangeTypes( startDate, endDate ).map( (type: string) => (
			priceSeriesLoader.loadData( exchange, symbol, type)
		));

		return Promise.all( promises );
	}
}

const typeIndices = {
	'hourly': 0,
	'daily': 1,
	'weekly': 2,
	'monthly': 3
};
const types = [
	'hourly', 'daily', 'weekly', 'monthly'
]

function getRangeTypes(startDate: number, endDate: number){
	if( startDate > endDate ){
		let start = startDate;
		startDate = endDate;
		endDate = start;
	}

	let startIndex = typeIndices[tickerTimer.getTypeFromTimestamp(startDate)];
	let endIndex = typeIndices[tickerTimer.getTypeFromTimestamp(endDate)];
	
	let range = [];
	while(startIndex >= endIndex ){
		range.push( types[startIndex--] );
	}
	return range;
}

export default new DataLoader<[number,number]>(config);