import store from '../../state/store'
import apiCacher, { DbBot } from '../../state/apiCacher'
import DataLoader, { DataLoaderConfig } from '../../utils/DataLoader'

const config: DataLoaderConfig<DbBot> = {
	getFromCache(id: string): DbBot | undefined {
		return store.bots[id];
	},
	loadData(id: string){
		let accountId = store.authenticatedId;
		return apiCacher.loadSingleBot( accountId, id );
	}
}

export default new DataLoader<DbBot>(config);