import {loader} from '../dataManager';
import apiCacher from '../apiCacher';
import { getAccountBotsSelector } from '../selectors/bot.selectors';
import { DbBot } from '../../../../lambdas/model.types';

export const botListLoader = loader<string,DbBot[]>({
	selector: getAccountBotsSelector,
	load: (accountId: string) => apiCacher.loadBotList(accountId)
});

