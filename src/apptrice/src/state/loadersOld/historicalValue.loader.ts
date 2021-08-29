import pairs from "../../../../lambdas/_common/utils/pairs";
import DataLoader, { DataLoaderConfig } from "../../utils/DataLoader";
import historicalPriceLoader from "./historicalPrice.loader";

const config: DataLoaderConfig<number> = {
	getFromCache(exchange: string, pair: string, amount: number, timestamp: number ): number | undefined {
		if( !amount ) return 0;
		
		let base = pairs.getBase(pair);
		let quoted = pairs.getQuoted(pair);

		if( base === quoted ) return amount;

		let {data: price} = historicalPriceLoader.getData(exchange, pair, timestamp);
		if( !price ) return;
		return price * amount;
	},
	loadData(exchange: string, pair: string, amount: number, timestamp: number) {
		return historicalPriceLoader.loadData( exchange, pair, timestamp)
			.then( () => {
				let price = this.getFromCache(exchange, pair, timestamp);
				if( price === undefined ){
					throw new Error('unexistant_exchange_pair');
				}
			})
		;
	}
}


export default new DataLoader<number>(config);