import { DbBot } from "../../../../lambdas/model.types";
import apiCacher from "../../state/apiCacher";
import store from "../../state/store";
import DataLoader, { DataLoaderConfig } from "../../utils/DataLoader";


const config: DataLoaderConfig<DbBot> = {
	getFromCache(botId: string, number: string): DbBot | undefined {
		return store.botVersions[`${botId}:${number}`];
	},
	loadData(botId: string, number: string){
		let accountId = store.authenticatedId;
		return apiCacher.loadSingleBotVersion( accountId, botId, number );
	}
}

export default new DataLoader<DbBot>(config);