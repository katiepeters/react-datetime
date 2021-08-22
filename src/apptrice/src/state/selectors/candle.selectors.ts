import { ArrayCandle } from '../../../../lambdas/lambda.types';
import { selector, Store } from '../dataManager';
import { CandlesDescriptor, getCandlesKey } from '../storeKeys';

export function candlesSelector( store: Store, descriptor: CandlesDescriptor) {
	return store.transientData.candles[ getCandlesKey(descriptor) ];
}

export const getCandles = selector<CandlesDescriptor, ArrayCandle[]>( candlesSelector );