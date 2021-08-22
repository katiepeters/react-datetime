import { Ticker } from "../../../../lambdas/_common/exchanges/ExchangeAdapter";
import DataLoader, { DataLoaderConfig } from "../../utils/DataLoader";
import { getS3Url } from "../selectors/environment.selectors";

const exchangePrices: {
	[exchange: string]: Ticker 
} = {};

const config: DataLoaderConfig<Ticker> = {
	getFromCache(exchange: string ): Ticker | undefined {
		return exchangePrices[exchange];
	},
	loadData(exchange: string ) {
		return fetch(`${getS3Url()}/exchanges/${exchange}/ticker`)
			.then( res => res.json() )
			.then( ticker => {
				exchangePrices[exchange] = ticker;
			})
		;
	}
}



export default new DataLoader<Ticker>(config);