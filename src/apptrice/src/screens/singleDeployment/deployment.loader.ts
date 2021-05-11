import { DBBotDeployment } from '../../../../lambdas/model.types';
import apiCacher from '../../state/apiCacher';
import store from '../../state/store'
import DataLoader, { DataLoaderConfig } from '../../utils/DataLoader';

const config: DataLoaderConfig<DBBotDeployment> = {
	getFromCache(id: string): DBBotDeployment | undefined {
		return store.deployments[id];
	},
	loadData(id: string) {
		let accountId = store.authenticatedId;
		return apiCacher.loadSingleDeployment(accountId, id);
	}
}

export default new DataLoader<DBBotDeployment>(config);