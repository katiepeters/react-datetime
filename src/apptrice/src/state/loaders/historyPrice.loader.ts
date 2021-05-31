import tickerTimer from "../../../../lambdas/_common/utils/tickerTimer";
import DataLoader, { DataLoaderConfig } from "../../utils/DataLoader";
import apiClient from "../apiClient";

type PriceTypeHistory = {
	[timestamp: number]: number
};

type PriceSymbolHistory = {
	hourly?: PriceTypeHistory,
	daily?: PriceTypeHistory,
	weekly?: PriceTypeHistory,
	monthly?: PriceTypeHistory,
};

type SymbolPromises = {
	[key: string]: Promise<any>
}

const types = ['hourly', 'daily', 'weekly', 'monthly'];
const typeValues = {
	hourly: 0,
	daily: 1,
	weekly: 2,
	monthly: 3
}

const priceHistory: {
	[exchange: string]: {
		[symbol: string]: PriceSymbolHistory
	} 
} = {};

const symbolPromises: SymbolPromises = {};


const config: DataLoaderConfig<number> = {
	getFromCache(exchange: string, symbol: string, timestamp: number ): number | undefined {
		if( !priceHistory[exchange] || !priceHistory[exchange][symbol] ) return;

		let symbolHistory: PriceSymbolHistory = priceHistory[exchange][symbol];
		let index = typeValues[getTypeFromTimestamp( timestamp )];
		
		while( index < types.length ){
			let type = types[index];
			//@ts-ignore
			if( symbolHistory[type] ){
				return getTypePrice( type, symbolHistory, timestamp );
			}
			index++;
		}
	},
	loadData( exchange: string, symbol: string, timestamp: number ) {
		let type = getTypeFromTimestamp( timestamp );
		let promiseKey = getKey(exchange, symbol, type );
		let promise = symbolPromises[ promiseKey ];
		if( promise ) return promise;

		symbolPromises[ promiseKey ] = apiClient.loadPrices(exchange, symbol, type)
			.then( res => {
				let history = priceHistory[exchange] || {};
				priceHistory[exchange] = {
					...history,
					[symbol]: {
						...(history || {} ),
						[type]: res
					}
				};
			})
		;

		return symbolPromises[ promiseKey ];
	}
}

const hourlyInterval = 100 * 60 * 60 * 1000;
const dailyInterval = hourlyInterval * 24;
const weeklyInterval = dailyInterval * 7;
function getTypeFromTimestamp(ts: number) {
	let now = Date.now();
	if( now - ts < hourlyInterval ) return 'hourly';
	if( now - ts < dailyInterval ) return 'daily';
	if( now - ts < weeklyInterval ) return 'weekly';
	return 'monthly';
}


function getTypePrice( type: string, history: PriceTypeHistory, timestamp: number ): number{
	return history[ getTypeTime( type, timestamp) ];
}

function getTypeTime( type: string, timestamp: number): number {
	if( type === 'hourly' ){
		return tickerTimer.getHourlyTime(timestamp);
	}
	else if( type === 'daily' ){
		return tickerTimer.getDailyTime(timestamp);
	}
	else if( type === 'weekly'){
		return tickerTimer.getWeeklyTime(timestamp);
	}
	return tickerTimer.getMonthlyTime(timestamp);
}

function getKey( exchange: string, symbol: string, type: string ){
	return `${exchange}_${symbol}_${type}`;
}


export default new DataLoader<number>(config);