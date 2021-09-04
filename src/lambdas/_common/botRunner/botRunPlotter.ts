export interface Plotter {
	plotPoint(collectionName: string, pair: string, value: number, chart?: string): void
	plotSeries(seriesName: string, pair: string, value: number, chart?: string): void
}

export interface PlotterInput {
	series: PairPlottingSeries,
	points: PairPlottingSeries,
	timestamp: number
}

export interface PairPlottingSeries {
	[pair: string]: ChartSeries
}
export interface ChartSeries {
	[chart: string]: PlotterSeries
}
export interface PlotterSeries {
	[name: string]: Coords[]
}
interface Coords {
	x: number
	y: number
}

export class BotRunPlotter {
	series: PairPlottingSeries
	points: PairPlottingSeries
	timestamp: number

	constructor({series,points,timestamp}: PlotterInput ){
		this.series = series;
		this.points = points;
		this.timestamp = timestamp;
	}

	plotPoint(collectionName: string, pair: string, value: number, chart?: string) {
		return plot(this.timestamp, this.points, collectionName, value, pair, chart || 'candles');
	}

	plotSeries(seriesName: string, pair: string, value: number, chart?: string) {
		return plot(this.timestamp, this.series, seriesName, value, pair, chart || 'candles');
	}

	getChartPoints( pair: string ){
		getPairPoints( this.points, pair );
	}

	getChartSeries( pair: string) {
		getPairPoints( this.series, pair );
	}
}

function plot( x: number, collection: PairPlottingSeries, name: string, y: number, pair: string, chart: string) {
	let pairSeries = collection[pair];
	if( !pairSeries ){
		pairSeries = {};
		collection[pair] = pairSeries;
	}

	let chartSeries = pairSeries[chart];
	if( !chartSeries ){
		chartSeries = {};
		pairSeries[chart] = chartSeries;
	}

	let points = chartSeries[name];
	if( !points ){
		points = [];
		chartSeries[name] = points;
	}
	points.push({x, y});
}

function getPairPoints( collection: PairPlottingSeries, pair: string ){
	let allPairsPoints = collection.all || {};
	let pairPoints = collection[pair] || {};

	let chartNames = new Set<string>(
		Object.keys(allPairsPoints).concat(Object.keys(pairPoints)))
	;
	
	const chartPoints = {};
	chartNames.forEach( (name: string) => {
		chartPoints[name] = {
			...allPairsPoints[name],
			...pairPoints[name]
		};
	});
	return chartPoints;
}