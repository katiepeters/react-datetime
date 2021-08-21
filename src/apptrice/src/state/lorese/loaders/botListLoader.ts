import lorese from '../../dataManager';
import apiCacher from '../../apiCacherLorese';
import { DbBot } from '../../../../../lambdas/model.types';
import { getAccountBotsSelector } from '../selectors/bot.selectors';
const {loader} = lorese;

export const botListLoader = loader<string,DbBot[]>({
	selector: getAccountBotsSelector,
	load: (accountId: string) => apiCacher.loadBotList(accountId)
});

