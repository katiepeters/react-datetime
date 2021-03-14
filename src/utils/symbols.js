export function getBase( symbol ){
	return symbol.split('/')[0];
}

export function getQuoted( symbol ){
	return symbol.split('/')[1];
}