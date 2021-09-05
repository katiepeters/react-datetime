import * as React from 'react'
import OrderSeries from './chartMarkers/OrderSeries';
import OHLC from './chartMarkers/OHLC';
import memoizeOne from 'memoize-one';
import { Order, PairPlotterData } from '../../../../lambdas/model.types';
import ChartX from './components/ChartX';
import { PlotterSeries } from '../../../../lambdas/_common/botRunner/botRunPlotter';
import chartUtils, { ChartData, colors, RunnableIndicator } from './chartUtils';
import { XAxis, YAxis } from '@react-financial-charts/axes';
import { Chart } from '@react-financial-charts/core';
import { CandlestickSeries, BarSeries, LineSeries, RSISeries } from '@react-financial-charts/series';
import { CrossHairCursor, EdgeIndicator, MouseCoordinateX, MouseCoordinateY } from '@react-financial-charts/coordinates';
import { MovingAverageTooltip, RSITooltip } from '@react-financial-charts/tooltip';

import { format} from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { PointSeries } from './components/PointSeries';
import { Line } from './components/Line';

interface DataByCharts {
	[chart: string]: ChartPlotterData
}

interface ChartPlotterData {
	points: PlotterSeries,
	series: PlotterSeries,
	indicators: string[]
}

export interface ChartCandle {
	date: number,
	open: number,
	close: number,
	high: number,
	low: number,
	volume: number
}


interface TradingChartProps {
	width: number,
	height: number,
	ratio: number,
	data: any,
	orders: Order[],
	patterns?: string[],
	candles: ChartCandle[],
	includePreviousCandles: boolean,
	onLoadMore?: (start: number, end: number ) => void,
	highlightedInterval?: [number, number],
	plotterData?: PairPlotterData
}

let chartIndex = 0;
export default class TradingChart extends React.Component<TradingChartProps> {
	chart?: any
	id: string = `chart${chartIndex++}`

	render() {
		return (
			<ChartX
				candles={this.getChartData()}
				onLoadMore={ this.props.onLoadMore }>
				{ this.renderCharts() }
				<CrossHairCursor
					strokeStyle="#cdccee"
					strokeDasharray="Dash"
					strokeWidth={1} />
			</ChartX>
		);
	}

	renderCharts() {
		const plotterDataByChart = getDataByChart(this.props.plotterData);
		const chartNames = Object.keys(plotterDataByChart);

		return [
			this.renderCandlesChart( plotterDataByChart.candles ),
			this.renderVolumeChart( plotterDataByChart.volume )
		];

		/*
		let charts = chartNames.map( (chartName:string, i: number) => {
			if( chartName === 'candles') return this.renderCandlesChart( plotterDataByChart.candles );
			if( chartName === 'volume') return this.renderVolumeChart( plotterDataByChart.volume );
			if( chartName === 'rsi' ) return this.renderRSIChart( plotterDataByChart.rsi, i );
			return this.renderCustomChart( chartName, plotterDataByChart[chartName], i );
		});

		charts.push( this.renderXAxisChart() );
		return charts;
		*/
	}

	renderCandlesChart( plotterData: ChartPlotterData ){
		const {orders} = this.props;
		const candles = this.getChartData();
		const indicators = chartUtils.getRunnableIndicators( plotterData?.indicators ).filter( i => i.tooltip === 'ma' );

		return (
			<Chart id={1} yExtents={(d: any) => [d.high, d.low]}>
				<XAxis axisAt="bottom" orient="bottom" {...axisStyles }/>
				<YAxis axisAt="right"
					orient="right"
					ticks={5}
					{...axisStyles} />
				{ this.renderMouseCoordinates() }
				{ this.renderIndicatorLineSeries( indicators )}
				<CandlestickSeries
					yAccessor={ chartUtils.candleAccessor }
					{...this.getCandleStyles('#d05773', '#29946d') } />
				<OrderSeries orders={orders} candles={candles} />
				{ this.renderPoints(plotterData.points) }
				{ this.renderLines(plotterData.series) }
				<OHLC
					origin={[-30,0]}
					textFill="#ffffff" />
				{ this.renderIndicatorTooltips(indicators) }
			</Chart>
		)
	}

	renderVolumeChart( plotterData: ChartPlotterData ) {
		const volumeAccessor = (d: any) => {
			return d.volume;
		}
		return (
			<Chart id={2}
				height={100}
				origin={(w: number, h: number) => [0, h - 100]}
				yExtents={volumeAccessor}>
				<YAxis axisAt="left"
					orient="left"
					ticks={3}
					tickFormat={this.getPriceFormat()}
					{...axisStyles}
					showGridLines={false} />
				<BarSeries
					yAccessor={volumeAccessor}
					fillStyle={ this.getCandleStyles('#78a4b9', '#bd66a9').fill } />
			</Chart>
		)
	}
	
	renderRSIChart( plotterData: ChartPlotterData, i: number ) {
		const indicators = chartUtils.getRunnableIndicators( this.props.plotterData?.indicators ).filter( i => i.type === 'rsi' );

		return (
			<Chart id="rsi"
				yExtents={() => [0,100]}>
				{ indicators.map( i => (
					<>
						<RSISeries yAccessor={chartUtils.getYAccessor(i.key)} />
						<RSITooltip origin={[-38, 15]}
							yAccessor={chartUtils.getYAccessor(i.key)}
							options={{windowSize: i.args[0]}} />
					</>
				))}
			</Chart>
		)
	}

	renderCustomChart( chartName: string, plotterData: ChartPlotterData, i:number ) {
		return (
			<Chart id={i}
				yExtents={() => [0,100]}>
				
			</Chart>
		)
	}

	renderXAxisChart(){
		return (
			<Chart id="xaxis">
				<XAxis />
			</Chart>
		);
	}

	renderMouseCoordinates() {
		return (
			<>
				<EdgeIndicator
					itemType="last"
					orient="right"
					edgeAt="right"
					yAccessor={ chartUtils.getYAccessor('close') }
					displayFormat={this.getPriceFormat()}
					fill="#011627"
					textFill="#cdccee"
					lineStroke="#444466"
					arrowWidth={0}
					rectHeight={12}
					fontSize={10} />
				<MouseCoordinateX
					at="bottom"
					orient="bottom"
					displayFormat={timeFormat("%y-%m-%d %H:%M")}
					fontSize={10} 
					rectHeight={14}
					fill="#172e45"/>
				<MouseCoordinateY
					at="right"
					orient="right"
					displayFormat={this.getPriceFormat()}
					arrowWidth={0}
					rectHeight={14}
					fontSize={10}
					fill="#172e45" />
			</>
		)
	}

	renderIndicatorTooltips( indicators: RunnableIndicator[] ) {
		if( !indicators.length ) return;

		let maOptions: any[] = [];
		indicators.forEach( (indicator: RunnableIndicator) => {
			if( indicator.tooltip === 'ma' ){
				maOptions.push({
					// @ts-ignore
					yAccessor: indicator.func.accessor(),
					type: indicator.type.toLocaleUpperCase(),
					windowSize: parseInt(indicator.args[0]),
					stroke: indicator.color
				});
			}
		});

		if( maOptions.length ){
			return (
				<MovingAverageTooltip
					origin={[-48, 10]}
					options={ maOptions }
					displayFormat={this.getPriceFormat()}
					labelFill="#f390dd"
					textFill="#b2b1d8" />
			)
		}
	}

	renderIndicatorLineSeries(indicators: RunnableIndicator[]) {
		if( !indicators.length ) return;

		return indicators.map( (indicator:any, i: number) => (
			<LineSeries key={indicator.key}
				yAccessor={indicator.func.accessor()}
				strokeStyle={indicator.color} />
		));
	}

	getCandleStyles( up:string, down:string) {
		const {highlightedInterval: hi} = this.props;
		let strokeColor: any = (d: ChartCandle) => {
			return d.close < d.open ? up : down;
		}

		if( hi ){
			strokeColor = function (d: ChartCandle) {
				let isHighlighted = d.date > hi[0] && d.date < hi[1];
				if( isHighlighted ){
					return d.close < d.open ? up : down;
				}
				return d.close < d.open ? up+'77' : down+'77';
			}
		}

		return {
			wickStroke: strokeColor,
			stroke: strokeColor,
			fill: strokeColor,
			opacity: 1
		}
	}

	getChartData(): ChartData[]{
		const {candles, plotterData} = this.props; 
		return augmentData( candles, plotterData?.indicators );
	}

	getPriceFormat(){
		const data = this.getChartData();
		return format(chartUtils.getFormat(data[0].close));
	}

	renderPoints( points?: PlotterSeries ){
		if( !points ) return;

		return Object.keys(points).map( (name,i) => (
			<PointSeries  
				key={name}
				name={name}
				points={points[name]}
				color={ colors[colors.length - i - 1] } />
		));
	}

	renderLines( lines?: PlotterSeries ){
		if( !lines ) return;

		return Object.keys(lines).map( (name,i) => (
			<Line
				key={name}
				name={name}
				points={lines[name]}
				strokeStyle={ colors[colors.length - i - 1] } />
		));
	}
}


const augmentData = memoizeOne( (candles: ChartCandle[], indicators?: string[] ) => {
	let augmented: ChartData[] = candles.map( c => ({...c, calculated:{}}) );

	if( !indicators || !indicators.length ){
		return augmented;
	}
	
	chartUtils.getRunnableIndicators(indicators).forEach( (ind) => {
		augmented = ind.func(augmented);
	})

	return augmented;
});

// Simply return the chart is it's there, if not creates, adds and return it
function getChart( currentCharts: DataByCharts, name: string ): ChartPlotterData{
	let chart = currentCharts[name];
	if( !chart ){
		chart = {points: {}, series: {}, indicators: []};
		currentCharts[name] = chart;
	}
	return chart;
}


const getDataByChart = memoizeOne( (plotterData?: PairPlotterData) =>  {
	let charts: DataByCharts = {
		candles: {points: {}, series: {}, indicators: []},
		volumes: {points: {}, series: {}, indicators: []}
	}
	if( !plotterData ) return charts;

	const { series, points, indicators } = plotterData;
	Object.keys( series ).forEach( (chartName: string) => {
		getChart(charts, chartName).series = series[chartName];
	});
	
	Object.keys( points ).forEach( (chartName: string) => {
		getChart(charts, chartName).points = points[chartName];
	});

	indicators.forEach( (indicator:string) => {
		let type = indicator.split(':')[0];
		if( type === 'rsi' ){
			getChart( charts, 'rsi' ).indicators.push(indicator);
		}
		else if( type === 'vma' ){
			getChart( charts, 'volume' ).indicators.push( indicator );
		}
		else {
			getChart(charts, 'candles').indicators.push( indicator );
		}
	});

	return charts;
});

const axisStyles: any = {
	tickLabelFill: '#cdccee',
	strokeStyle: '#172e45',
	fontSize: 10,
	showGridLines: true,
	tickStrokeStyle: '#172e45',
	gridLinesStrokeStyle: '#172e45',
	gridLinesStrokeDasharray: 'Solid',
	gridLinesStrokeWidth: 1
}