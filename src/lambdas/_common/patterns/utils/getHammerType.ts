import { ArrayCandle } from "../../../lambda.types";

// hammer rule, a candle with:
// - one stick that is at least the double than the other
// - other stick that is at most the half of the body

export function getHammerType( candle: ArrayCandle ){
	// open < close
	const [bodyUp, bodyDown] = candle[1] < candle[2] ?
		[candle[2], candle[1]] :
		[candle[1], candle[2]]
	;
	const bodyHeight = bodyUp - bodyDown;
	// Exit earlier if it's obvious
	if( bodyHeight * 3 > candle[3] - candle[4] ){
		return 'none';
	}

	const upperStick = candle[3] - bodyUp;
	const lowerStick = bodyDown - candle[4];

	// The upper stick is the double of the body -> hammer down
	if( upperStick>2*bodyHeight && lowerStick<0.5*bodyHeight ){
		return 'down';
	}

	// the lower stick is the double of the body -> hammer up
	if( upperStick<.5*bodyHeight && lowerStick> 0.5*bodyHeight ){
		return 'up';
	}

	return 'none';
}