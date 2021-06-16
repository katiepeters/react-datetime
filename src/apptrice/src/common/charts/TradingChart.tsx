import * as React from 'react'
import { Orders } from '../../../../lambdas/lambda.types';
import OrderSeries from './chartMarkers/OrderSeries';
import OHLC from './chartMarkers/OHLC';

const { ChartCanvas, Chart } = require('react-stockcharts');
const { last, timeIntervalBarWidth } = require("react-stockcharts/lib/utils");
const { XAxis, YAxis } = require('react-stockcharts/lib/axes');
const { CandlestickSeries, BarSeries } = require('react-stockcharts/lib/series');
const { CrossHairCursor, EdgeIndicator, MouseCoordinateX, MouseCoordinateY } = require('react-stockcharts/lib/coordinates');
const { fitWidth } = require('react-stockcharts/lib/helper');

const { scaleTime } = require('d3-scale');
const { utcHour } = require('d3-time');
const { format } = require('d3-format');
const { timeFormat } = require('d3-time-format');


export interface ChartCandle {
	date: Date,
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
	orders: Orders,
	candles: ChartCandle[],
	includePreviousCandles: boolean
}

let chartIndex = 0;
class TradingChart extends React.Component<TradingChartProps> {
	chart?: any
	id: string = `chart${chartIndex++}`

	render() {
		const { width, ratio, candles, orders } = this.props;
		// This is the data for the x axis
		const xAccessor = (d: any) => d.date;
		// These are the initial limits for the x zoom
		const xExtents = [
			xAccessor(last(candles)),
			xAccessor(candles[0])
		];

		const volumeAccessor = (d: any) => {
			return d.volume;
		}

		const height = 400;

		return (
			<ChartCanvas
				width={width}
				height={height}
				ratio={ratio}
				type="hybrid"
				data={candles}
				xAccessor={xAccessor}
				xScale={scaleTime()}
				xExtents={xExtents}
				margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
				pointsPerPxThreshold={.6}>


				<Chart id={1} yExtents={(d: any) => [d.high, d.low]}>
					<XAxis axisAt="bottom"
						orient="bottom"
						ticks={6}
						fill="#172e45"
						strokeOpacity={1}
						stroke="#172e45"
						fontSize={10}
						innerTickSize={-height + 40}
						tickStroke="#cdccee"
						tickStrokeOpacity={.15}
						tickStrokeDasharray="Solid"
						tickStrokeWidth={1} />
					<YAxis axisAt="right"
						orient="right"
						ticks={5}
						fill="#172e45"
						strokeOpacity={1}
						stroke="#172e45"
						fontSize={10}
						innerTickSize={-width + 100}
						tickStroke="#cdccee"
						tickStrokeOpacity={.15}
						tickStrokeDasharray="Solid"
						tickStrokeWidth={1} />
					<CandlestickSeries
						width={timeIntervalBarWidth(utcHour)}
						{...candleStyles} />
					<OrderSeries orders={orders} candles={candles} />
					<EdgeIndicator
						itemType="last"
						orient="right"
						edgeAt="right"
						yAccessor={ (d:any) => d.close }
						fill="#011627"
						textFill="#cdccee"
						lineStroke="#cdccee"
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
						displayFormat={format(".2f")}
						arrowWidth={0}
						rectHeight={14}
						fontSize={10}
						fill="#172e45" />
					<OHLC
						origin={[-30,0]}
						textFill="#ffffff" />
				</Chart>
				<Chart id={2}
					origin={(w: number, h: number) => [0, h - 100]}
					height={100} yExtents={volumeAccessor}>
					<YAxis axisAt="left"
						orient="left"
						ticks={3}
						tickFormat={format(".2s")}
						stroke="#172e45"
						tickStroke="#cdccee"
						fontSize={10} />
					<BarSeries yAccessor={volumeAccessor}
						fill={(d: any) => d.close > d.open ? "#6BA583" : "#f390dd"} />
				</Chart>
				<CrossHairCursor
					stroke="#cdccee"
					strokeDasharray="Dash"
					strokeWidth={1} />
			</ChartCanvas>
		);
	}
}

const TradingChartWidth = fitWidth(TradingChart);
export default TradingChartWidth;


function strokeColor(d: any) {
	return d.close < d.open ? "#d05773" : "#29946d";
}

const candleStyles = {
	wickStroke: strokeColor,
	stroke: strokeColor,
	fill: strokeColor,
	opacity: 1
}
