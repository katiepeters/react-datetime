import * as React from 'react'
import { ScreenProps } from '../../../types'
import TradingChart from '../../backtesting/btCharts/TradingChart'

export default class BotDetailsScreen extends React.Component<ScreenProps> {
	render() {
		let { quickStore } = this.props;
		let candles = quickStore.getCandles();

		if (!Object.keys(candles).length) {
			return <div>Please run backtesting</div>;
		}

		return (
			<div style={{ width: '100%' }}>
				<TradingChart
					orders={quickStore.getOrders()}
					candles={candles} />
			</div>
		)
	}
}