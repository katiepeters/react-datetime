import { DBBotDeploymentWithHistory } from '../../../../../lambdas/model.types';
import apiCacher from '../../apiCacherLorese';
import lorese from '../../dataManager';
import { getDeploymentSelector } from '../selectors/deployment.selectors';
const {loader} = lorese;

interface deploymentLoadInput {
	accountId: string,
	deploymentId: string
}

export const deploymentLoader = loader<deploymentLoadInput, DBBotDeploymentWithHistory>({
	selector: (store, {deploymentId}) => {
		let deployment = getDeploymentSelector(store, deploymentId);
		if( deployment && ('portfolioHistory' in deployment) ){
			return deployment;
		}
	},
	load: ({accountId,deploymentId}) => {
		return apiCacher.loadSingleDeployment(accountId,deploymentId);
	}
})