import {loader} from '../stateManager';
import apiCacher from '../apiCacher';
import { getBotSelector } from '../selectors/bot.selectors';
import { DbBot } from '../../../../lambdas/model.types';

export interface BotLoadInput {
	accountId: string
	botId: string
}

export const botLoader = loader<BotLoadInput,DbBot[]>({
	selector: (store, {botId}) => getBotSelector(store, botId),
	load: ({accountId,botId}) => apiCacher.loadSingleBot(accountId, botId)
});

