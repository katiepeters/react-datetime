import apiCacher from '../apiCacher';
import { loader, StoreBotVersion } from '../dataManager';
import { botVersionSelector } from '../selectors/botVersion.selectors';

interface BotVersionLoadInput {
	accountId: string,
	botId: string,
	versionNumber: string
}

export const botVersionLoader = loader<BotVersionLoadInput, StoreBotVersion>({
	selector: botVersionSelector,
	load: ({accountId,botId,versionNumber}) => apiCacher.loadSingleBotVersion(accountId,botId,versionNumber)
})