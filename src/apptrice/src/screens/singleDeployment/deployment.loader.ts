import { DBBotDeployment } from '../../../../lambdas/model.types';
import apiCacher from '../../state/apiCacher';
import store from '../../state/store'
import DataLoader, { DataLoaderConfig } from '../../utils/DataLoader';

const config: DataLoaderConfig<DBBotDeployment> = {
	getFromCache(id: string): DBBotDeployment | undefined {
		let deployment = store.deployments[id];
		if( deployment && deployment.orders ){
			return deployment;
		}
	},
	loadData(id: string) {
		let accountId = store.authenticatedId;
		return apiCacher.loadSingleDeployment(accountId, id);
	}
}

export default new DataLoader<DBBotDeployment>(config);