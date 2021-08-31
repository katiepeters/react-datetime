export interface Plotter {
	plotPoint(collectionName: string, value: number, pair?: string, chart?: string): void
	plotSeries(seriesName: string, value: number, pair?: string, chart?: string): void
}

export interface PlotterInput {
	series: PairPlottingSeries,
	points: PairPlottingSeries,
	timestamp: number
}

export interface PairPlottingSeries {
	[pair: string]: ChartSeries
}
interface ChartSeries {
	[chart: string]: PlotterSeries
}
interface PlotterSeries {
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

	plotPoint(collectionName: string, value: number, pair?: string, chart?: string) {
		return plot(this.timestamp, this.points, collectionName, value, pair || 'all', chart || 'main');
	}

	plotSeries(seriesName: string, value: number, pair?: string, chart?: string) {
		return plot(this.timestamp, this.series, seriesName, value, pair || 'all', chart || 'secondary');
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
		pairSeries = collection[pair] = {};
	}

	let chartSeries = pairSeries[chart] || {};
	if( !chartSeries ){
		chartSeries = pairSeries[chart] || {};
	}

	let points = chartSeries[name] || [];
	if( !points ){
		points = chartSeries[name] = [];
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