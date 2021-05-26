import symbols from "../../../../lambdas/_common/utils/symbols";
import DataLoader, { DataLoaderConfig } from "../../utils/DataLoader";
import tickerLoader from './ticker.loader';


const config: DataLoaderConfig<number> = {
	getFromCache(exchange: string, amount: string, symbol: string ): number | undefined {
		let base = symbols.getBase(symbol);
		let quoted = symbols.getQuoted(symbol);

		if( base === quoted ) return parseFloat(amount);

		let {data: prices} = tickerLoader.getData(exchange);

		if( !prices ) return;

		// Direct price conversion
		let symbolData = prices[symbol];
		if( symbolData ){
			return parseFloat(amount) * symbolData.price;
		}

		// Through USD
		let baseData = prices[`${base}/USD`];

		if( !symbolData ) return;

		let quotedData = prices[`${quoted}/USD`];

		if( !quotedData ) return;

		return parseFloat(amount) * baseData.price / quotedData.price;
	},
	loadData(exchange: string, amount: string, symbol: string ) {
		return tickerLoader.loadData( exchange )
			.then( () => {
				let price = this.getFromCache( exchange, amount, symbol );
				if( price === undefined ){
					throw new Error('unexistant_exchange_symbol');
				}
			})
		;
	}
}


export default new DataLoader<number>(config);