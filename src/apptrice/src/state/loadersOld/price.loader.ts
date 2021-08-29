import pairs from "../../../../lambdas/_common/utils/pairs";
import DataLoader, { DataLoaderConfig } from "../../utils/DataLoader";
import tickerLoader from './ticker.loader';


const config: DataLoaderConfig<number> = {
	getFromCache(exchange: string, amount: string, pair: string ): number | undefined {
		let base = pairs.getBase(pair);
		let quoted = pairs.getQuoted(pair);

		if( base === quoted ) return parseFloat(amount);

		let {data: prices} = tickerLoader.getData(exchange);

		if( !prices ) return;

		// Direct price conversion
		let pairData = prices[pair];
		if( pairData ){
			return parseFloat(amount) * pairData.price;
		}

		// Through USD
		let baseData = prices[`${base}/USD`];

		if( !pairData ) return;

		let quotedData = prices[`${quoted}/USD`];

		if( !quotedData ) return;

		return parseFloat(amount) * baseData.price / quotedData.price;
	},
	loadData(exchange: string, amount: string, pair: string ) {
		return tickerLoader.loadData( exchange )
			.then( () => {
				let price = this.getFromCache( exchange, amount, pair );
				if( price === undefined ){
					throw new Error('unexistant_exchange_pair');
				}
			})
		;
	}
}


export default new DataLoader<number>(config);