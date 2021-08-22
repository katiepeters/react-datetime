import { selector, Store, StoreBotVersion } from '../stateManager';
import { BotVersionDescriptor, getVersionKey } from '../storeKeys';

export function botVersionSelector(store: Store, descriptor: BotVersionDescriptor ): StoreBotVersion | void {
	return store.botVersions[ getVersionKey(descriptor) ];
}
export const getBotVersion = selector<BotVersionDescriptor,StoreBotVersion|void>( botVersionSelector );
