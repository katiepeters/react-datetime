import * as React from 'react'
const { nest: d3Nest } = require("d3-collection");

const GenericChartComponent = require('react-stockcharts/lib/GenericChartComponent').default;
const { getAxisCanvas } = require('react-stockcharts/lib/GenericComponent');
const {hexToRGBA, functor} = require('react-stockcharts/lib/utils');
const {CircleMarker, TriangleMarker, SquareMarker} = require('react-stockcharts/lib/series');
const { last, timeIntervalBarWidth } = require("react-stockcharts/lib/utils");
const { utcHour } = require('d3-time');

interface OrderSeriesProps {
	orders: any
}

export default class OrderSeries extends React.Component<OrderSeriesProps> {
	drawOnCanvas = (ctx: any, moreProps: any) => {
		const { xScale, chartConfig: { yScale }} = moreProps;
		const { orders } = this.props;

		const markerStyles = {
			stroke: "9999ff",
			strokeWidth: 1,
			opacity: 0.5,
			fill: "#ccccff",
			r: 4
		};

		orders.forEach((order: any) => {
			const point = {
				x: xScale(order.closedAt),
				y: yScale(order.executedPrice || order.price)
			}

			const {Marker, props} = getMarker( order );

			const styles = {
				opacity: .5,
				strokeWidth: 1,
				...props
			}

			console.log('Drawing order!!', point);
			Marker.drawOnCanvas(styles, point, ctx);
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

function getMarker( order: any){
	let color = getColor( order.status, order.direction );

	switch( order.status ){
		case 'completed':
			return {
				Marker: TriangleMarker,
				props: {
					stroke: color,
					fill: color,
					direction: order.direction === 'buy' ? 'left' : 'right',
					width: 8
				}
			};
		case 'cancelled':
			return {
				Marker: SquareMarker,
				props: {
					stroke: color,
					fill: color,
					width: 8
				}
			};
		default: 
			return {
				Marker: CircleMarker,
				props: {
					stroke: color,
					fill: color,
					r: 2
				}
			};
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