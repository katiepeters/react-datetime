import memoizeOne from 'memoize-one';
import { DbBot, DbBotInput, DbBotVersion } from '../../../../../lambdas/model.types';
import lorese, { Store, StoreBotVersion } from '../../dataManager';
import { getAccount, getAuthenticatedId } from './account.selectors';


const {selector} = lorese;

interface BotVersionDescriptor {
	botId: string,
	versionNumber: string
}

export function getVersionKey( descriptor: BotVersionDescriptor ){
	return `${descriptor.botId}:${descriptor.versionNumber}`;
}
export function botVersionSelector(store: Store, descriptor: BotVersionDescriptor ): StoreBotVersion | void {
	return store.botVersions[ getVersionKey(descriptor) ];
}
export const getBotVersion = selector<BotVersionDescriptor,StoreBotVersion|void>( botVersionSelector );
