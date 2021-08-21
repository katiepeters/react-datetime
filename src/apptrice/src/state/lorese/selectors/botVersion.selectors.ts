import lorese, { Store, StoreBotVersion } from '../../dataManager';
import { BotVersionDescriptor, getVersionKey } from '../../storeKeys';
const {selector} = lorese;

export function botVersionSelector(store: Store, descriptor: BotVersionDescriptor ): StoreBotVersion | void {
	return store.botVersions[ getVersionKey(descriptor) ];
}
export const getBotVersion = selector<BotVersionDescriptor,StoreBotVersion|void>( botVersionSelector );
