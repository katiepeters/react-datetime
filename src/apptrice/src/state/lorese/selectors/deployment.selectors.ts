import memoizeOne from 'memoize-one'
import lorese, { Store, StoreBotDeployment } from '../../dataManager';
const {selector} = lorese;

const getAccountListSelector = (store: Store, accountId: string): StoreBotDeployment[] | void => {
	const account = store.accounts[accountId];
	if( !account || !account.deployments ) return;

	return accountListMemo( account.deployments, store.deployments );
}
const getAccountList = selector<string,StoreBotDeployment[] | void>(getAccountListSelector);

const accountListMemo = memoizeOne( (ids, deployments ) => {
	return ids.map( (id:string) => deployments[id] )
});

export {getAccountList, getAccountListSelector};
