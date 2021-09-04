import { ArrayCandle, CandleAttribute } from "../../lambda.types";
const attributeIndex = {
	open: 1,
	close: 2,
	hight: 3,
	low: 4,
	volume: 5
}

export function rsi(data: ArrayCandle[], period: number) {
	let gains: number[] = [];
	let loses: number[] = [];
	let gainSum = 0;
	let loseSum = 0;
	let length = data.length;
	let values: number[] = new Array(length);

	values[0] = 0;

	for( let i = 1; i<period; i++ ){
		let value = data[i][2] - data[i-1][2];
		if( value > 0 ){
			gains.push( value / period);
			gainSum += value;
			loses.push( 0 );
		}
		else {
			loses.push( (-value) / period);
			loseSum -= value;
			gains.push( 0 );
		}
		if( loseSum === 0 ){
			values[i] = 100;
		}
		else {
			values[i] = 100 - (100 * (1/(1+(gainSum/loseSum))));
		}
	}

	// Second loop, substracting the last value from the gains and loses
	// with two loops for this, we save a condition check in every iteration
	for( let i = period; i<length; i++ ){
		gainSum -= gains[i-period];
		loseSum -= loses[i-period];

		let value = data[i][2] - data[i-1][2];
		if( value > 0 ){
			loses.push( (-value) / period);
			loseSum -= value;
			gains.push( 0 );
		}
		else {
			gains.push( value / period);
			gainSum += value;
			loses.push( 0 );
		}

		if( loseSum === 0 ){
			values[i] = 100;
		}
		else {
			values[i] = 100 - (100 * (1/(1+(gainSum/loseSum))));
		}
	}

	return values;
}

export function rsiArray(data: number[], period: number) {
	let gains: number[] = [];
	let loses: number[] = [];
	let gainSum = 0;
	let loseSum = 0;
	let length = data.length;
	let values: number[] = new Array(length);

	values[0] = 0;

	for( let i = 1; i<period; i++ ){
		let value = (data[i] - data[i-1];
		if( value > 0 ){
			gains.push( value / period);
			gainSum += value;
			loses.push( 0 );
		}
		else {
			loses.push( (-value) / period);
			loseSum -= value;
			gains.push( 0 );
		}
		if( loseSum === 0 ){
			values[i] = 100;
		}
		else {
			values[i] = 100 - (100 * (1/(1+(gainSum/loseSum))));
		}
	}

	// Second loop, substracting the last value from the gains and loses
	// with two loops for this, we save a condition check in every iteration
	for( let i = period; i<length; i++ ){
		gainSum -= gains[i-period];
		loseSum -= loses[i-period];

		let value = data[i] - data[i-1];
		if( value > 0 ){
			loses.push( (-value) / period);
			loseSum -= value;
			gains.push( 0 );
		}
		else {
			gains.push( value / period);
			gainSum += value;
			loses.push( 0 );
		}

		if( loseSum === 0 ){
			values[i] = 100;
		}
		else {
			values[i] = 100 - (100 * (1/(1+(gainSum/loseSum))));
		}
	}

	return values;
}