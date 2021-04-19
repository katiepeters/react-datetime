import memoizeOne from "memoize-one";
import { DBBotDeployment } from "../../../../lambdas/model.types";
import apiCacher from "../../state/apiCacher";
import store from "../../state/store";
import DataLoader from "../../utils/DataLoader";

const loader = new DataLoader<DBBotDeployment[]>({
	loadData( accountId: string ){
		return apiCacher.loadDeploymentList(accountId);
	},
	getFromCache(accountId: string) {
		let deploymentIds = store.accounts[accountId]?.deployments;
		if( !deploymentIds ) return;
		
		return memoDeployments(deploymentIds, store.deployments);
	}
});

export default loader;



const memoDeployments = memoizeOne( ( deploymentIds: any[], deployments: any ): DBBotDeployment[] => {
	return deploymentIds.map((id: string) => deployments[id]);
});