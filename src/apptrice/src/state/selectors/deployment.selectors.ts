import memoizeOne from 'memoize-one'
import { selector, Store, StoreBotDeployment } from '../stateManager';

export const getDeploymentListSelector = (store: Store, accountId: string): StoreBotDeployment[] | void => {
	const account = store.accounts[accountId];
	if( !account || !account.deployments ) return;

	return deploymentListMemo( account.deployments, store.deployments );
}

export const getDeploymentList = selector<string,StoreBotDeployment[] | void>(getDeploymentListSelector);

const deploymentListMemo = memoizeOne( (ids, deployments ) => {
	return ids.map( (id:string) => deployments[id] )
});

export function getDeploymentSelector(store: Store, deploymentId: string){
	return store.deployments[deploymentId];
}

export const getDeployment = selector<string,StoreBotDeployment|void>( getDeploymentSelector );

