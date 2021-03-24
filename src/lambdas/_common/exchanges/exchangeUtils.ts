const intervalTime = {
	'5m': 5 * 60 * 1000,
	'10m': 10 * 60 * 1000,
	'30m': 30 * 60 * 1000,
	'1h': 60 * 60 * 1000,
	'4h': 4 * 60 * 60 * 1000,
	'1d': 24 * 60 * 60 * 1000
};
const exchangeUtils = {
	getLastCandleAt(interval: string, ts: number) {
		let rest = ts % intervalTime[interval];
		return ts - rest;
	}
}

export default exchangeUtils;