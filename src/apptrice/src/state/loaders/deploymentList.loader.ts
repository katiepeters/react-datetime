import { loader, StoreBotDeployment } from '../dataManager';
import {getDeploymentListSelector} from '../selectors/deployment.selectors';
import apiCacher from '../apiCacher';

export const deploymentListLoader = loader<string,StoreBotDeployment[]>({
	selector: getDeploymentListSelector,
	load: (accountId: string) => apiCacher.loadDeploymentList(accountId)
});

