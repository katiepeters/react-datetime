import { ArrayCandle } from "../../lambda.types";
import { sma, smaArray } from "../indicators/sma";


type CandleAttribute = 'open' | 'close' | 'high' | 'low' | 'volume';
export interface Indicators {
	/** Calculates the Standard Moving Average from an array of candle data. By default uses the `close` attribute. */
	sma( candleData: ArrayCandle[], period: number, attr?: CandleAttribute ): number[]
	/** Calculates the Standard Moving Average from an array of values. */
	smaArray( candleData: number[], period: number ): number[]
	/** Calculates the Standard Moving Average for candle volumes. */
	vma( candleData: ArrayCandle[], period: number ): number[]
	/** Calculates the Relative Strength Index for an array of candle data. */
	rsi( candleData: ArrayCandle, period: number): number[]
}


export class BotRunIndicators implements Indicators {
	// The used indicators will be automatically plotted in the charts
	indicatorsUsed: {[indicator:string]: boolean}

	constructor( indicators: string[] = [] ) {
		let used = {};
		indicators.forEach( (indicator: string) => used[indicator] = true );
		this.indicatorsUsed = used;
	}

	sma( candleData: ArrayCandle[], period: number, attr: CandleAttribute = 'close' ) {
		this.indicatorsUsed[`sma|${period}|${attr}`] = true;
		return sma(candleData, period, attr);
	}

	vma( candleData: ArrayCandle[], period: number ) {
		this.indicatorsUsed[`vma|${period}`] = true;
		return sma(candleData, period, 'volume');
	}

	rsi( candleData: ArrayCandle, period: number){
		this.indicatorsUsed[`rsi|${period}`] = true;
		return this.rsi(candleData, period);
	}

	smaArray( candleData: number[], period: number) {
		// This indicator can't be displayed in the charts, don't store in the used ones
		return smaArray(candleData, period);
	}
}