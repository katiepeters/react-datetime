import { ArrayCandle, CandleAttribute } from "../../lambda.types";

const attributeIndex = {
	open: 1,
	close: 2,
	hight: 3,
	low: 4,
	volume: 5
}

export function sma(data: ArrayCandle[], period: number, attr: CandleAttribute = 'close') {
	let sum = 0;
	let length = data.length;
	let values = new Array<number>(length);
	let attrIndex = attributeIndex[attr];

	for( let i = 0; i<period; i++ ){
		sum += data[i][attrIndex];
		values[i] = 0;
	}

  values[period-1] = sum / period;

	for( let i = period; i<length; i++){
		sum += data[i][attrIndex] - data[i-period][attrIndex];
		values[i] = sum / period;
	}

	return values;
}

export function smaArray( data: number[], period: number ){
	let sum = 0;
	let length = data.length;
	let values = new Array<number>(length);

	for( let i = 0; i<period; i++ ){
		sum += data[i];
		values[i] = 0;
	}

  values[period-1] = sum / period;

	for( let i = period; i<length; i++){
		sum += data[i] - data[i-period];
		values[i] = sum / period;
	}

	return values;
}