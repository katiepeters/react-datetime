import memoizeOne from 'memoize-one';
import { DbExchangeAccount } from '../../../../../lambdas/model.types';
import lorese, { Store } from '../../dataManager';
import { getAccount, getAuthenticatedId } from './account.selectors';

const {selector} = lorese;

export function getExchangesSelector(store: Store, accountId: string): DbExchangeAccount[] | void{
	const account = getAccount(accountId);
	if( !account || !account.exchangeAccounts ) return;

	return getExchangesMemo( account.exchangeAccounts, store.exchangeAccounts );
}

export const getAccountExchanges = selector<string,DbExchangeAccount[]|void>( getExchangesSelector );
export const getExchangeList = selector<string,DbExchangeAccount[]|void>( (store, accountId) => (
	getExchangesSelector( store, getAuthenticatedId() )
));

const getExchangesMemo = memoizeOne( (ids, exchanges) => {
	return ids.map( (id:string) => exchanges[id]);
})