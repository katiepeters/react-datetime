import * as React from 'react'
import { ArrayCandle } from '../../../../lambdas/lambda.types';
import candleLoader from '../../screens/singleDeployment/charts/candle.loader';
import { Order } from '../../../../lambdas/model.types';
import TradingChart, {ChartCandle} from './TradingChart';
import memoizeOne from 'memoize-one';

interface AutoChartProps {
	symbol: string,
	exchange: string,
	interval: string,
	orders: Order[],
	startDate?: number,
	endDate?: number
}

export default class AutoChart extends React.Component<AutoChartProps> {
	render() {
		let {symbol, exchange, interval, orders, startDate, endDate} = this.props;
		if (!startDate) {
			let orderDates = this.getOrderDates(orders, interval);
			startDate = orderDates.startDate;
			endDate = orderDates.endDate;
		}

		let {data: candles} = candleLoader.getData(exchange, symbol, interval, String(startDate), String(endDate));

		return (
			<div>
				{ candles ? this.renderChart( candles ) : 'Loading...' }
			</div>
		);
	}

	renderChart( candles: ArrayCandle[] ) {
		return (
			<TradingChart
				orders={this.props.orders}
				candles={ getChartCandles(candles) } />
		)
	}

	now = 0;
	getOrderDates( orders: Order[], interval: string ){
		let {startDate, endDate} = this.getDefaultIntervalDates(interval);

		let halfInterval = (endDate - startDate) / 2;
		let startOrder = orders[0];
		let lastOrder = orders[orders.length-1];

		if (startOrder && lastOrder) {
			return {
				startDate: startOrder.createdAt - halfInterval,
				endDate: Math.min(this.now, (lastOrder.closedAt || lastOrder.createdAt) + halfInterval)
			}
		}
		return {startOrder, lastOrder};
	}

	getDefaultIntervalDates( interval: string ){
		if( !this.now ){
			this.now = Date.now();
		}

		const endDate = this.now;

		// Right now interval is just 1h, adapt this based on the interval in the future.
		const startDate = endDate - (2 * 24 * 60 * 60 * 1000); // two days for one hour interval.
		return {startDate, endDate};
	}
}

const getChartCandles = memoizeOne( (candles: ArrayCandle[]) => {
	return candles.map( toChartCandle );
});

function toChartCandle( c: ArrayCandle ): ChartCandle{
	return {
		date: new Date(c[0]),
		open: c[1],
		close: c[2],
		high: c[3],
		low: c[4],
		volume: c[5]
	}
}
