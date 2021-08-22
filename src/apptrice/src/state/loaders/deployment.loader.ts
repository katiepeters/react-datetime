import { DBBotDeploymentWithHistory } from '../../../../lambdas/model.types';
import apiCacher from '../apiCacher';
import {loader} from '../stateManager';
import { getDeploymentSelector } from '../selectors/deployment.selectors';

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