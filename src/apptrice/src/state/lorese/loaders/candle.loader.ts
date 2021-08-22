import { ArrayCandle } from '../../../../../lambdas/lambda.types';
import apiCacher from '../../apiCacherLorese';
import lorese  from '../../dataManager';
import { CandlesDescriptor } from '../../storeKeys';
import { candlesSelector } from '../selectors/candle.selectors';
const {loader} = lorese;

export const candleLoader = loader<CandlesDescriptor, ArrayCandle[]>({
	selector: candlesSelector,
	load: ({symbol, runInterval, startDate, endDate}) => apiCacher.loadCandles({
		symbol, runInterval, startDate, endDate
	})
});

