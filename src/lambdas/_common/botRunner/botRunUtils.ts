import { ArrayCandle } from "../../lambda.types";

export interface Candle {
	open: number
	close: number
	high: number
	low: number
	volume: number
	date: number
	getMiddle(): number
	getAmplitude(): number
	isBullish(): boolean
}

function getMiddle(): number {
	return (this.high + this.low) / 2;
}

function getAmplitude(): number {
	return (this.high - this.low) / this.low;
}

function isBullish(): boolean {
	return this.open < this.close;
}

export interface BotRunUtils {
	/** Converts candle data in an array into a structured object to make candle property access simpler. */
	getCandle( candleData: ArrayCandle ): Candle
	/** Converts an array of arrayCandles into an array of structured objects to make candle property access simpler. */
	getCandles( candleData: ArrayCandle[] ): Candle[]
	/** Returns quoted and base assets of a pair */
	getPairAssets( pair: string ): {quoted: string, base: string}
	/** Returns true when the target series cross over the base series. */
	isCrossOver( targetSeries: number[], baseSeries: number[] ): boolean[]
	/** Returns true when the target series cross under the base series. */
	isCrossUnder( targetSeries: number[], baseSeries: number[] ): boolean[]
}

export const botRunUtils: BotRunUtils = {
	getCandle: toCandle,

	getCandles( candleData ){
		return candleData.map( toCandle )
	},

	getPairAssets( pair: string ) {
		const [base, quoted] = pair.split('/');
		return {base, quoted};
	},

	isCrossOver( targetSeries: number[], baseSeries: number[] ): boolean[] {
		return isCrossOver(targetSeries, baseSeries );
	},
	
	isCrossUnder( targetSeries: number[], baseSeries: number[]): boolean[] {
		return isCrossOver(baseSeries, targetSeries);
	}
}

function isCrossOver( targetSeries: number[], baseSeries: number[] ): boolean[]{
	let maxLength = Math.max( targetSeries.length, baseSeries.length );
	let minLength = Math.min( targetSeries.length, baseSeries.length );
	let diff = maxLength - minLength;
	let results = new Array<boolean>(maxLength);

	let target = targetSeries.slice(-minLength);
	let base = baseSeries.slice(-minLength);

	for(let i = 0; i<diff+1; i++ ){
		results[i] = false;
	}

	for(let i = 1; i< target.length; i++ ){
		results[diff+i] = target[i-1] < base[i-1] && target[i] > base[i];
	}

	return results;
}


function toCandle( candleData: ArrayCandle ): Candle {
	return {
		date: candleData[0],
		open: candleData[1],
		close: candleData[2],
		high: candleData[3],
		low: candleData[4],
		volume: candleData[5],
		getMiddle,
		getAmplitude,
		isBullish
	}
}