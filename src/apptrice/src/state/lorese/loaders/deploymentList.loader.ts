import lorese, { StoreBotDeployment } from '../../dataManager';
import {getAccountListSelector} from '../selectors/deployment.selectors';
import apiCacher from '../../apiCacherLorese';
const {loader} = lorese;

export const deploymentListLoader = loader<string,StoreBotDeployment[]>({
	selector: getAccountListSelector,
	load: (accountId: string) => apiCacher.loadDeploymentList(accountId)
});

