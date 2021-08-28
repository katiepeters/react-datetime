import { ArrayCandle } from "../../../lambda.types";
import { getHammerType } from "./getHammerType";

// This function is used by the `hangingMan` and `shootingStar` indicators

// Simple definition:
// * without confimation:
//		- the current candle is a hammer whose high is higher than the previous one
// * with confirmation
// 		- the previous candle was an unconfirmed hammer and the current is bearish
export function bearishHammer(candles: ArrayCandle[], isConfirmed: boolean, hammerType: 'down' | 'up'): boolean[] {
	let length = candles.length;
	let result = new Array<boolean>(length);
	result[0] = false;
	if( isConfirmed ){
		result[1] = false;
		for(let i = 2; i<length; i++){
			result[i] = candles[i-2][3] < candles[i-1][3] && candles[i][2] > candles[i][1] && getHammerType(candles[i]) === hammerType;
		}
	}
	else {
		for(let i = 1; i<length; i++){
			result[i] = candles[i-1][3] < candles[i][3] && getHammerType(candles[i]) === hammerType;
		}
	}
	return result;
}