import { ArrayCandle } from "../../lambda.types";
import { bearishHammer } from "./utils/bearishHammer";

export function shootingStar(candles: ArrayCandle[], isConfirmed: boolean = false ): boolean[] {
	return bearishHammer(candles, isConfirmed, 'down');
}