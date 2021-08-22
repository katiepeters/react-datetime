import {loader} from '../dataManager';
import apiCacher from '../apiCacher';
import { getExchangesSelector } from '../selectors/exchange.selectors';
import { DbExchangeAccount } from '../../../../lambdas/model.types';

export const exchangeListLoader = loader<string,DbExchangeAccount[]>({
	selector: getExchangesSelector,
	load: (accountId: string) => apiCacher.loadExchangeAccountList(accountId)
});

