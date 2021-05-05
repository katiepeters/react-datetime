import { DbExchangeAccount } from "../../../../lambdas/model.types";
import DataLoader, { DataLoaderConfig } from "../../utils/DataLoader";
import apiCacher from "../apiCacher";
import store from "../store";

const config: DataLoaderConfig<DbExchangeAccount[]> = {
	getFromCache(accountId: string): DbExchangeAccount[] | undefined {
		let exchanges = store.accounts[accountId]?.exchangeAccounts;
		if (exchanges) {
			return exchanges.map((id: string) => store.exchangeAccounts[id]);
		}
	},
	loadData(accountId: string) {
		return apiCacher.loadExchangeAccountList(accountId);
	}
}


export default new DataLoader<DbExchangeAccount[]>(config);