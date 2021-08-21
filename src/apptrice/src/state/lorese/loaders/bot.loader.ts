import lorese from '../../dataManager';
import apiCacher from '../../apiCacherLorese';
import { DbBot } from '../../../../../lambdas/model.types';
import { getBotSelector } from '../selectors/bot.selectors';
const {loader} = lorese;

export interface BotLoadInput {
	accountId: string
	botId: string
}

export const botLoader = loader<BotLoadInput,DbBot[]>({
	selector: (store, {botId}) => getBotSelector(store, botId),
	load: ({accountId,botId}) => apiCacher.loadSingleBot(accountId, botId)
});

