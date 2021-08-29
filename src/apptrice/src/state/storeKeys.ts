export interface BotVersionDescriptor {
	botId: string,
	versionNumber: string
}

export function getVersionKey( descriptor: BotVersionDescriptor ){
	return `${descriptor.botId}:${descriptor.versionNumber}`;
}

export interface CandlesDescriptor {
	exchange: string,
	pair: string,
	runInterval: string,
	startDate: number,
	endDate: number
}
export function getCandlesKey( {exchange, pair, runInterval, startDate, endDate}: CandlesDescriptor ){
	return `${exchange}:${pair}:${runInterval}:${startDate}:${endDate}`;
}