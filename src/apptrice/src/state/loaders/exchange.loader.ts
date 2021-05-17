import { DbExchangeAccount } from "../../../../lambdas/model.types";
import DataLoader, { DataLoaderConfig } from "../../utils/DataLoader";
import apiCacher from "../apiCacher";
import store from "../store";


const config: DataLoaderConfig<DbExchangeAccount> = {
	getFromCache(exchangeId: string): DbExchangeAccount | undefined {
		let exchange = store.exchangeAccounts[exchangeId];
		if (exchange && exchange.portfolioHistory){
			return exchange;
		}
	},
	loadData(exchangeId: string) {
		let accountId = store.authenticatedId;
		return apiCacher.loadSingleExchangeAccount(accountId, exchangeId);
	}
}


export default new DataLoader<DbExchangeAccount>(config);