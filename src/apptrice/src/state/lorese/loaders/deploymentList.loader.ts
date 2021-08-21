import lorese, { StoreBotDeployment } from '../../dataManager';
import {getDeploymentListSelector} from '../selectors/deployment.selectors';
import apiCacher from '../../apiCacherLorese';
const {loader} = lorese;

export const deploymentListLoader = loader<string,StoreBotDeployment[]>({
	selector: getDeploymentListSelector,
	load: (accountId: string) => apiCacher.loadDeploymentList(accountId)
});

