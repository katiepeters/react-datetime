import lorese from '../../dataManager';
import apiCacher from '../../apiCacherLorese';
import { DbExchangeAccount } from '../../../../../lambdas/model.types';
import { exchangeSelector } from '../selectors/exchange.selectors';
const {loader} = lorese;

interface ExchangeLoadInput {
	accountId: string
	exchangeId: string
}

export const exchangeLoader = loader<ExchangeLoadInput,DbExchangeAccount>({
	selector: (store, {exchangeId}) => exchangeSelector(store, exchangeId),
	load: ({accountId, exchangeId}) => apiCacher.loadSingleExchangeAccount(accountId, exchangeId)
});

