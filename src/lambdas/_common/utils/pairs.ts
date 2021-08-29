function getBase( pair:string ): string{
	return pair.split('/')[0];
}

function getQuoted( pair:string ): string{
	return pair.split('/')[1];
}

export default {getBase, getQuoted};