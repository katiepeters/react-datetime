export interface BotVersionDescriptor {
	botId: string,
	versionNumber: string
}

export function getVersionKey( descriptor: BotVersionDescriptor ){
	return `${descriptor.botId}:${descriptor.versionNumber}`;
}

export interface CandlesDescriptor {
	exchange: string,
	symbol: string,
	runInterval: string,
	startDate: string,
	endDate: string
}
export function getCandlesKey( {exchange, symbol, runInterval, startDate, endDate}: CandlesDescriptor ){
	return `${exchange}:${symbol}:${runInterval}:${startDate}:${endDate}`;
}