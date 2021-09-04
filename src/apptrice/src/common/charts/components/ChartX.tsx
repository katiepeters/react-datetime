import * as React from 'react'
import { ChartCandle } from '../TradingChart';

import { ChartCanvas } from '@react-financial-charts/core';
import { withSize, withDeviceRatio } from '@react-financial-charts/utils';

import {scaleTime} from 'd3-scale';
import chartUtils from '../chartUtils';

interface ChartXProps {
	width: number,
	height: number,
	ratio: number,
	candles?: ChartCandle[], // Candles are not optional, but couldn't make it work with `withSize,withDeviceRatio` any other way
	initialCandlesInView?: number,
	onLoadMore?: (start: number, end: number ) => void,
}

class ChartX extends React.Component<ChartXProps> {

	extentsInitialized = false;
	extents: [number, number] = [0,0]
	scale = scaleTime()
	margins = { left: 50, right: 50, top: 10, bottom: 30 }

	render() {
		const { width, ratio, height, children, initialCandlesInView = 140 } = this.props;
		const candles = this.getCandles();

		return (
			<ChartCanvas
				seriesName="trading"
				width={width}
				height={height}
				ratio={ratio}
				data={candles}
				xAccessor={chartUtils.xAccessor}
				xScale={this.scale}
				xExtents={this.getExtents()}
				margin={this.margins}
				pointsPerPxThreshold={.6}
				onLoadBefore={ this.props.onLoadMore }>
				{children}
			</ChartCanvas>
		)
	}

	getExtents(){
		if( !this.extentsInitialized ){
			let candles = this.getCandles();
			let {initialCandlesInView = 150} = this.props;
			this.extents = [
				chartUtils.xAccessor(candles.slice(-1)[0]),
				chartUtils.xAccessor(candles[Math.max(0,candles.length - initialCandlesInView)])
			];
			this.extentsInitialized = true;
		}
		return this.extents;
	}

	getCandles(): ChartCandle[]{
		return this.props.candles || [];
	}
}

// Responsiveness
const sized = withSize({style: {minHeight: 500}});
const rationed = withDeviceRatio();
const ChartXWidth = sized( rationed(ChartX) );
export default ChartXWidth;
