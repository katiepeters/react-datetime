import * as React from 'react';
import OrderSeries from './OrderSeries';
import memoize from 'memoize-one';
import { ArrayCandle, BotCandles, Orders } from '../../../../../lambdas/lambda.types';

const { scaleTime } = require('d3-scale');
const { utcHour } = require('d3-time');
const { format } = require('d3-format');

const { ChartCanvas, Chart } = require('react-stockcharts');
const { CandlestickSeries, BarSeries, ScatterSeries, LineSeries, CircleMarker} = require('react-stockcharts/lib/series');
const { XAxis, YAxis } = require('react-stockcharts/lib/axes');
const { fitWidth } = require('react-stockcharts/lib/helper');
const { last, timeIntervalBarWidth } = require("react-stockcharts/lib/utils");
const { CrossHairCursor } = require('react-stockcharts/lib/coordinates');

const rawCandles = require('./candlesData.json');
const rawOrders = require('./orders.json');

const orders: any = {};
Object.values(rawOrders).forEach( (order:any) => {
	if( order.symbol === 'BTC/USD' ){
		orders[order.id] = order;
	}
})

let linesIndex = 0;
let lines: any[] = [
	{
		id: 'l1',
		start: 1618030800000,
		end: 1618056000000,
		price: 60461,
		direction: 'buy',
		closeReasong: 'completed',
		slot: -1
	},
	{
		id: 'l2',
		start: 1618040800000,
		end: 1618181000000,
		price: 60161,
		direction: 'sell',
		closeReasong: 'completed',
		slot: -1
	}
];
let linesById: any = {
	l1: lines[0],
	l2: lines[1]
}

let currentLines: any[] = [];

let maxLinesCount = 2;
let candles: any[] = [];
rawCandles.forEach( (c:any) => {
	let data: any = {
		date: new Date(c[0]),
		open: c[1],
		close: c[2],
		high: c[3],
		low: c[4],
		volume: c[5]
	};

	let candleLines = [];
	let i = currentLines.length;
	while( i-- > 0){
		let l = currentLines[i];
		if( l.end < c[0] ){
			currentLines.splice(i, 1);
		}
		else {
			candleLines[l.slot] = l.id;
		}
	}

	while( lines[linesIndex] && lines[linesIndex].start <= c[0] ){
		let i = 0;
		while( candleLines[i] ){
			i++;
		}

		let l = lines[linesIndex];
		l.slot = i;
		currentLines.push(l);
		candleLines[i] = l.id;
		linesIndex++;
	}

	data.lines = candleLines;

	candles.push(data);
});


interface TradingChartProps {
	width: number,
	height: number,
	ratio: number,
	data: any,
	orders: Orders,
	candles: BotCandles
}

let chartIndex = 0;
class TradingChart extends React.PureComponent<TradingChartProps> {
	chart?: any
	id: string = `chart${chartIndex++}`

	render() {
		const { width, ratio } = this.props;
		// This is the data for the x axis
		const xAccessor = (d:any) => d.date;
		// These are the initial limits for the x zoom
		const candles = this.getAssetCandles('BTC/USD');
		const orders = this.getAssetOrders('BTC/USD');
		const xExtents = [
			xAccessor(last(candles)),
			xAccessor(candles[0])
		];

		const volumeAccessor = (d:any) => {
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


				<Chart id={1} yExtents={(d:any) => [d.high, d.low]}>
					<XAxis axisAt="bottom" orient="bottom" ticks={6} fill="#ffffff" strokeOpacity={1} stroke="#ffffff" tickStroke="#ffffff" />
					<YAxis axisAt="right" orient="right" ticks={5} fill="#ffffff" strokeOpacity={1} stroke="#ffffff" tickStroke="#ffffff" />
					<CandlestickSeries
						width={timeIntervalBarWidth(utcHour)}
						{...candleStyles }/>
				</Chart>
				<Chart id={2}
					origin={(w:number, h:number) => [0, h - 100]}
					height={100} yExtents={volumeAccessor}>
					<YAxis axisAt="left" orient="left" ticks={3} tickFormat={format(".2s")} stroke="#ffffff" tickStroke="#ffffff" />
						<BarSeries yAccessor={volumeAccessor}
							fill={(d:any) => d.close > d.open ? "#6BA583" : "red"} />
				</Chart>

				<Chart id={3} yExtents={(d: any) => [d.high, d.low]}>
					<OrderSeries orders={orders} />
				</Chart>

				<CrossHairCursor stroke="rgba(255,255,255,.5)" strokeDasharray="LongDashDot" />
			</ChartCanvas>
		);
	}

	renderLines( initialId: number ){
		let lineId = 0;
		let lines = [];
		while( lineId < maxLinesCount ){
			lines.push(
				this.renderLine( initialId, lineId )
			);
			lineId++;
		}
		return lines;
	}

	renderLine( initialId: number, lineId: number ){
		let id = initialId + lineId;

		let accessor = (d:any) => {
			let line:any = linesById[d.lines[lineId]];
			if( line ){
				return line.price;
			}
		};

		return (
			<Chart id={id} key={id} yExtents={(d: any) => [d.high, d.low]}>
				<ScatterSeries
					yAccessor={accessor}
					marker={CircleMarker}
					markerProps={{ r: 3 }} />
				<LineSeries
					yAccessor={accessor}
					stroke="#ff7f0e"
					strokeDasharray="Dot" />
			</Chart>
		);
	}

	componentDidUpdate(){
		this.chart?.render();
	}

	renderOrderSeries() {
		return (
			<OrderSeries
				orders={orders} />
		);
	}

	getAssetCandles( asset:string ){
		return memoizeCandles( this.props.candles[asset] );
	}

	getAssetOrders( asset:string ){
		let {orders: allOrders} = this.props;
		return memoizeAssetOrders( allOrders, asset );
	}
}

const memoizeAssetOrders = memoize( (allOrders: Orders, asset: string ) => {
	// @ts-ignore
	let orders = allOrders.flatten ? allOrders.flatten() : allOrders;
	return Object.values( orders ).filter( (order: any) => order.symbol === asset );
});

const memoizeCandles = memoize( (proxyCandles: any) => {
	let candles = proxyCandles.flatten ? proxyCandles.flatten() : proxyCandles;
	return candles.map( (c: ArrayCandle) => {
		return {
			date: new Date(c[0]),
			open: c[1],
			close: c[2],
			high: c[3],
			low: c[4],
			volume: c[5]
		}
	});
});

const TradingChartWidth = fitWidth(TradingChart);
export default TradingChartWidth;


function strokeColor(d: any) {
	return d.close < d.open ? "#f00" : "#0f0";
}

const candleStyles = {
	wickStroke: strokeColor,
	stroke: strokeColor
}