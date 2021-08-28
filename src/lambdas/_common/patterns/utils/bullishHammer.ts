import { ArrayCandle } from "../../../lambda.types";
import { getHammerType } from "./getHammerType";

// This function is used by the `hammer` and `inverseHammer` indicators

// Simple definition:
// * without confimation:
//		- the current candle is a hammer whose low is lower than the previous one
// * with confirmation
// 		- the previous candle was an unconfirmed hammer and the current is upwards
export function bullishHammer(candles: ArrayCandle[], isConfirmed: boolean, hammerType: 'down' | 'up'): boolean[] {
	let length = candles.length;
	let result = new Array<boolean>(length);
	result[0] = false;
	if( isConfirmed ){
		result[1] = false;
		for(let i = 2; i<length; i++){
			result[i] = candles[i-2][4] > candles[i-1][4] && candles[i][2] > candles[i][1] && getHammerType(candles[i]) === hammerType;
		}
	}
	else {
		for(let i = 1; i<length; i++){
			result[i] = candles[i-1][4] > candles[i][4] && getHammerType(candles[i]) === hammerType;
		}
	}
	return result;
}