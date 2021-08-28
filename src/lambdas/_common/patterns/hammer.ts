import { ArrayCandle } from "../../lambda.types";
import { bullishHammer } from "./utils/bullishHammer";

// Simple definition:
// * without confimation:
//		- the current candle is a hammer whose low is lower than the previous one
// * with confirmation
// 		- the previous candle was an unconfirmed hammer and the current is upwards
export function hammer(candles: ArrayCandle[], isConfirmed: boolean = false ): boolean[] {
	return bullishHammer(candles, isConfirmed, 'up');
}