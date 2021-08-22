import tickerTimer from "../../../../lambdas/_common/utils/tickerTimer";
import DataLoader, { DataLoaderConfig } from "../../utils/DataLoader";
import priceSeriesLoader, {PriceTypeHistory} from "./priceSeries.loader";

const config: DataLoaderConfig<number> = {
	getFromCache(exchange: string, symbol: string, timestamp: number ): number | undefined {
		let type = tickerTimer.getTypeFromTimestamp( timestamp );
		let prices = priceSeriesLoader.getFromCache(
			exchange, symbol, type
		);

		if( prices ){
			return getTypePrice( type, prices, timestamp );
		}
	},
	loadData( exchange: string, symbol: string, timestamp: number ) {
		let type = tickerTimer.getTypeFromTimestamp( timestamp );
		return priceSeriesLoader.loadData( exchange, symbol, type );
	}
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

export default new DataLoader<number>(config);