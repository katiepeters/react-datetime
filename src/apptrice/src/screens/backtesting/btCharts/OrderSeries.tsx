import * as React from 'react'
const { nest: d3Nest } = require("d3-collection");

const GenericChartComponent = require('react-stockcharts/lib/GenericChartComponent').default;
const { getAxisCanvas } = require('react-stockcharts/lib/GenericComponent');
const {hexToRGBA, functor} = require('react-stockcharts/lib/utils');
const {CircleMarker, TriangleMarker} = require('react-stockcharts/lib/series');
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

		Object.values(orders).forEach((order: any) => {
			if (order.status !== 'completed') return;

			const point = {
				x: xScale(order.closedAt),
				y: yScale(order.executedPrice)
			}

			console.log('Drawing order!!', point);
			CircleMarker.drawOnCanvas(markerStyles, point, ctx);
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

function getMarker( order: any, datum: any ){
	if( !order ) return CircleMarker;
	let time = datum.date().getTime();

	if( order.start <= time ){
		return {
			marker: CircleMarker
		}
	}

}