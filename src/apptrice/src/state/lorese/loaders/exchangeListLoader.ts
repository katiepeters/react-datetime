import lorese from '../../dataManager';
import apiCacher from '../../apiCacherLorese';
import { getExchangesSelector } from '../selectors/exchange.selectors';
import { DbExchangeAccount } from '../../../../../lambdas/model.types';
const {loader} = lorese;

export const exchangeListLoader = loader<string,DbExchangeAccount[]>({
	selector: getExchangesSelector,
	load: (accountId: string) => apiCacher.loadExchangeAccountList(accountId)
});

