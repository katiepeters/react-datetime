import { ArrayCandle } from "../../lambda.types";
import { sma, smaArray } from "../indicators/sma";


type CandleAttribute = 'open' | 'close' | 'high' | 'low' | 'volume';
export interface Indicators {
	/** Calculates the Standard Moving Average from an array of candle data. By default uses the `close` attribute. */
	sma( candleData: ArrayCandle[], period: number, attr?: CandleAttribute ): number[]
	/** Calculates the Standard Moving Average from an array of values. */
	smaArray( candleData: number[], period: number ): number[]
}


export class BotRunIndicators implements Indicators {
	// The used indicators will be automatically plotted in the charts
	indicatorsUsed: {[indicator:string]: boolean}

	constructor( used: {[indicator:string]: boolean} = {} ) {
		this.indicatorsUsed = used;
	}

	sma( candleData: ArrayCandle[], period: number, attr: CandleAttribute = 'close' ) {
		this.indicatorsUsed[`sma|${period}|${attr}`] = true;
		return sma(candleData, period, attr);
	}

	smaArray( candleData: number[], period: number) {
		// This indicator can't be displayed in the charts, don't store in the used ones
		return smaArray(candleData, period);
	}
}