import apiCacher from '../apiCacher';
import {loader}  from '../stateManager';
import { CandlesDescriptor } from '../storeKeys';
import { candlesSelector } from '../selectors/candle.selectors';
import { ArrayCandle } from '../../../../lambdas/lambda.types';

export const candleLoader = loader<CandlesDescriptor, ArrayCandle[]>({
	selector: candlesSelector,
	load: ({pair, runInterval, startDate, endDate}) => apiCacher.loadCandles({
		pair, runInterval, startDate, endDate
	})
});

