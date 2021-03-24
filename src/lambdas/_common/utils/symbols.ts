function getBase( symbol:string ): string{
	return symbol.split('/')[0];
}

function getQuoted( symbol:string ): string{
	return symbol.split('/')[1];
}

export default {getBase, getQuoted};