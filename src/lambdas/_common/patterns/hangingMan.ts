import { ArrayCandle } from "../../lambda.types";
import { bearishHammer } from "./utils/bearishHammer";

export function hangingMan(candles: ArrayCandle[], isConfirmed: boolean = false ): boolean[] {
	return bearishHammer(candles, isConfirmed, 'up');
}