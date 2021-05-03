import * as React from 'react'
import { Order } from '../../../../../lambdas/lambda.types';
import BuyMarker from './markers/BuyMarker';
import ErrorMarker from './markers/ErrorMarker';
import SellMarker from './markers/SellMarker';

const GenericChartComponent = require('react-stockcharts/lib/GenericChartComponent').default;
const { getAxisCanvas } = require('react-stockcharts/lib/GenericComponent');
const {CircleMarker, SquareMarker} = require('react-stockcharts/lib/series');

interface OrderSeriesProps {
	orders: any,
	candles: any[]
}

export default class OrderSeries extends React.Component<OrderSeriesProps> {
	drawOnCanvas = (ctx: any, moreProps: any) => {
		const { xScale, chartConfig: { yScale }} = moreProps;
		const { orders, candles } = this.props;

		orders.forEach((order: any) => {
			renderOpening( ctx, xScale, yScale, order );
			renderLine(ctx, xScale, yScale, order, candles );
			renderClosing( ctx, xScale, yScale, order );
		});
	}

	renderSVG = (moreProps: any) => {
		//Not implemented
		return null;
	}
	render() {
		return <GenericChartComponent
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			canvasToDraw={getAxisCanvas}
			drawOn={["pan"]}
		/>;
	}
}

function renderOpening( ctx: any, xScale: any, yScale: any, order: Order ){
	if( order.closedAt === order.placedAt ) return;

	const color = getColor(order.status, order.direction);
	const point = {
		x: xScale(order.placedAt),
		y: yScale(order.price)
	}

	const styles = {
			stroke: color,
			fill: color,
			r: 2,
			opacity: .5,
			strokeWidth: 1,
	}

	CircleMarker.drawOnCanvas( styles, point, ctx );
}

function renderLine( ctx: any, xScale: any, yScale: any, order: Order, candles: any[] ){
	if( order.closedAt === order.placedAt ) return;

	let closedAt = order.closedAt || getLastCandleTime(candles);

	ctx.save();

	const color = getColor(order.status, order.direction);
	ctx.strokeStyle = color;
	ctx.lineWidth = 1;
	ctx.setLineDash([1, 2]);
	const p1 = {
		x: xScale(order.placedAt),
		y: yScale(order.price),
	};
	const p2 = {
		x: xScale(closedAt),
		y: yScale(order.price),
	};

	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p2.x, p2.y);
	ctx.stroke();

	ctx.restore();
}

function renderClosing( ctx: any, xScale: any, yScale: any, order: Order ){
	if(!order.closedAt) return;

	const Marker = getMarker(order);
	const color = getColor(order.status, order.direction);

	const styles = {
		stroke: color,
		fill: color,
		width: order.status === 'cancelled' ? 4 : 8,
		opacity: order.status === 'cancelled' ? .1 : .5,
		strokeWidth: 1,
	};
	const point = {
		x: xScale(order.closedAt),
		y: yScale(order.executedPrice || order.price)
	}

	Marker.drawOnCanvas(styles, point, ctx);
}


function getMarker( order: any){
	switch( order.status ){
		case 'completed':
			return order.direction === 'buy' ? BuyMarker : SellMarker;
		case 'cancelled':
			return SquareMarker;
		case 'error':
			return ErrorMarker;
		default:
			return CircleMarker;
	}
}

function getColor( status: string, direction: string ){
	if( direction === 'buy' ){
		if( status === 'completed' ){
			return '#00cc00';
		}
		else if( status === 'placed' ){
			return '#00ff00';
		}
		return '#66cc66';
	}

	// sell
	if (status === 'completed') {
		return '#cc0000';
	}
	else if (status === 'placed') {
		return '#ff0000';
	}
	return '#cc6666';
}

function getLastCandleTime( c: any[] ){
	return c[c.length -1].date.getTime();
}