import apiCacher from '../apiCacher';
import {loader}  from '../dataManager';
import { CandlesDescriptor } from '../storeKeys';
import { candlesSelector } from '../selectors/candle.selectors';
import { ArrayCandle } from '../../../../lambdas/lambda.types';

export const candleLoader = loader<CandlesDescriptor, ArrayCandle[]>({
	selector: candlesSelector,
	load: ({symbol, runInterval, startDate, endDate}) => apiCacher.loadCandles({
		symbol, runInterval, startDate, endDate
	})
});

