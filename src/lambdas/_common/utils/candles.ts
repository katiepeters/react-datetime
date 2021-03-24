import { ArrayCandle } from "../../lambda.types";

function getLast(candles: ArrayCandle[]): ArrayCandle {
	return candles[candles.length - 1];
}

function getTime(candle: ArrayCandle): number {
	return candle[0];
}

function getOpen(candle: ArrayCandle): number {
	return candle[1];
}

function getClose(candle: ArrayCandle): number {
	return candle[2];
}

function getHigh(candle: ArrayCandle): number {
	return candle[3];
}

function getLow(candle: ArrayCandle): number {
	return candle[4];
}

function getVolume(candle: ArrayCandle): number {
	return candle[5];
}

function getMiddle(candle: ArrayCandle): number {
	return (getHigh(candle) + getLow(candle)) / 2;
}

function getAmplitude(candle: ArrayCandle): number {
	return (getHigh(candle) - getLow(candle)) / getLow(candle);
}

export default {
	getLast, getTime, getOpen, getClose,
	getHigh, getLow, getVolume, getMiddle,
	getAmplitude
}