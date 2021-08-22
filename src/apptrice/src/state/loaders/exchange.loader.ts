import {loader} from '../dataManager';
import apiCacher from '../apiCacher';
import { exchangeSelector } from '../selectors/exchange.selectors';
import { DbExchangeAccount } from '../../../../lambdas/model.types';

interface ExchangeLoadInput {
	accountId: string
	exchangeId: string
}

export const exchangeLoader = loader<ExchangeLoadInput,DbExchangeAccount>({
	selector: (store, {exchangeId}) => exchangeSelector(store, exchangeId),
	load: ({accountId, exchangeId}) => apiCacher.loadSingleExchangeAccount(accountId, exchangeId)
});

