import * as React from 'react'
import { Orders } from '../../../../lambdas/lambda.types';
import OrderSeries from './chartMarkers/OrderSeries';

const { ChartCanvas, Chart } = require('react-stockcharts');
const { last, timeIntervalBarWidth } = require("react-stockcharts/lib/utils");
const { XAxis, YAxis } = require('react-stockcharts/lib/axes');
const { CandlestickSeries, BarSeries } = require('react-stockcharts/lib/series');
const { CrossHairCursor } = require('react-stockcharts/lib/coordinates');
const { fitWidth } = require('react-stockcharts/lib/helper');

const { scaleTime } = require('d3-scale');
const { utcHour } = require('d3-time');
const { format } = require('d3-format');


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

		return (
			<ChartCanvas
				width={width}
				height={400}
				ratio={ratio}
				type="hybrid"
				data={candles}
				xAccessor={xAccessor}
				xScale={scaleTime()}
				xExtents={xExtents}
				margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
				pointsPerPxThreshold={.6}>


				<Chart id={1} yExtents={(d: any) => [d.high, d.low]}>
					<XAxis axisAt="bottom" orient="bottom" ticks={6} fill="#ffffff" strokeOpacity={1} stroke="#ffffff" tickStroke="#ffffff" />
					<YAxis axisAt="right" orient="right" ticks={5} fill="#ffffff" strokeOpacity={1} stroke="#ffffff" tickStroke="#ffffff" />
					<CandlestickSeries
						width={timeIntervalBarWidth(utcHour)}
						{...candleStyles} />
					<OrderSeries orders={orders} candles={candles} />
				</Chart>
				<Chart id={2}
					origin={(w: number, h: number) => [0, h - 100]}
					height={100} yExtents={volumeAccessor}>
					<YAxis axisAt="left" orient="left" ticks={3} tickFormat={format(".2s")} stroke="#ffffff" tickStroke="#ffffff" />
					<BarSeries yAccessor={volumeAccessor}
						fill={(d: any) => d.close > d.open ? "#6BA583" : "red"} />
				</Chart>

				<CrossHairCursor stroke="rgba(255,255,255,.5)" strokeDasharray="LongDashDot" />
			</ChartCanvas>
		);
	}
}

const TradingChartWidth = fitWidth(TradingChart);
export default TradingChartWidth;


function strokeColor(d: any) {
	return d.close < d.open ? "#f00" : "#0f0";
}

const candleStyles = {
	wickStroke: strokeColor,
	stroke: strokeColor
}
