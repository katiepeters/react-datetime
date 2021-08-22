import { ArrayCandle } from '../../../../lambdas/lambda.types';
import { selector, Store } from '../stateManager';
import { CandlesDescriptor, getCandlesKey } from '../storeKeys';

export function candlesSelector( store: Store, descriptor: CandlesDescriptor) {
	return store.transientData.candles[ getCandlesKey(descriptor) ];
}

export const getCandles = selector<CandlesDescriptor, ArrayCandle[]>( candlesSelector );