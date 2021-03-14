export function getLast( candles ){
	return candles[candles.length - 1];
}

export function getTime( candle ){
	return candle[0];
}

export function getOpen( candle ){
	return candle[1];
}

export function getClose( candle ){
	return candle[2];
}

export function getHigh( candle ){
	return candle[3];
}

export function getLow( candle ){
	return candle[4];
}

export function getVolume( candle ){
	return candle[5];
}

export function getMiddle( candle ){
	return (getHigh(candle) + getLow(candle)) / 2;
}

export function getAmplitude( candle ){
	return (getHigh(candle) - getLow(candle)) / getLow(candle);
}