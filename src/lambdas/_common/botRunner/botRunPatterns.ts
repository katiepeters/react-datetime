import { ArrayCandle } from "../../lambda.types";
import { hammer } from "../patterns/hammer";
import { hangingMan } from "../patterns/hangingMan";
import { inverseHammer } from "../patterns/inverseHammer";
import { shootingStar } from "../patterns/shootingStar";

export interface Patterns {
	hammer(candles: ArrayCandle[], isConfirmed?: boolean): boolean[],
	hangingMan(candles: ArrayCandle[], isConfirmed?: boolean): boolean[],
	inverseHammer(candles: ArrayCandle[], isConfirmed?: boolean): boolean[],
	shootingStar(candles: ArrayCandle[], isConfirmed?: boolean): boolean[],
}

export class BotRunPatterns {
	patternsUsed: {[pattern: string]: boolean}
	constructor( patterns: string[] = [] ) {
		let used = {};
		patterns.forEach( (pattern: string) => used[pattern] = true );
		this.patternsUsed = used;
	}

	hammer(candles: ArrayCandle[], isConfirmed: boolean = false): boolean[] {
		this.patternsUsed[`hammer|${isConfirmed}`] = true;
		return hammer(candles, isConfirmed);
	}

	hangingMan(candles: ArrayCandle[], isConfirmed: boolean = false): boolean[] {
		this.patternsUsed[`hangingMan|${isConfirmed}`] = true;
		return hangingMan(candles, isConfirmed);
	}

	inverseHammer(candles: ArrayCandle[], isConfirmed: boolean = false): boolean[] {
		this.patternsUsed[`inverseHammer|${isConfirmed}`] = true;
		return inverseHammer(candles, isConfirmed);
	}

	shootingStar(candles: ArrayCandle[], isConfirmed: boolean = false): boolean[] {
		this.patternsUsed[`shootingStar|${isConfirmed}`] = true;
		return shootingStar(candles, isConfirmed);
	}
}

