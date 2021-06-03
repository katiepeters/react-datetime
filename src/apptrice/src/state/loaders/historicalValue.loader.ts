import symbols from "../../../../lambdas/_common/utils/symbols";
import DataLoader, { DataLoaderConfig } from "../../utils/DataLoader";
import historicalPriceLoader from "./historicalPrice.loader";

const config: DataLoaderConfig<number> = {
	getFromCache(exchange: string, symbol: string, amount: number, timestamp: number ): number | undefined {
		if( !amount ) return 0;
		
		let base = symbols.getBase(symbol);
		let quoted = symbols.getQuoted(symbol);

		if( base === quoted ) return amount;

		let {data: price} = historicalPriceLoader.getData(exchange, symbol, timestamp);
		if( !price ) return;
		return price * amount;
	},
	loadData(exchange: string, symbol: string, amount: number, timestamp: number) {
		return historicalPriceLoader.loadData( exchange, symbol, timestamp)
			.then( () => {
				let price = this.getFromCache(exchange, symbol, timestamp);
				if( price === undefined ){
					throw new Error('unexistant_exchange_symbol');
				}
			})
		;
	}
}


export default new DataLoader<number>(config);