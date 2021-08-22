import memoizeOne from 'memoize-one';
import { DbBot } from '../../../../lambdas/model.types';
import { selector, Store } from '../stateManager';
import { getAccount, getAuthenticatedId } from './account.selectors';

export function getAccountBotsSelector(store: Store, accountId: string): DbBot[]|void {
	const account = getAccount(accountId);
	if( !account || !account.bots ) return;

	return getAccountBotsMemo( account.bots, store.bots );
}
export const getAccountBots = selector<string,DbBot[]|void>( getAccountBotsSelector );

export const getBotList = selector<string,DbBot[]|void>( (store) => getAccountBotsSelector(store, getAuthenticatedId()) );

export function getBotSelector(store: Store, botId: string): DbBot | void {
	return store.bots[botId];
}
export const getBot = selector<string, DbBot|void>( getBotSelector );

const getAccountBotsMemo = memoizeOne( (ids, bots) => {
	return ids.map( (id:string) => bots[id] );
});