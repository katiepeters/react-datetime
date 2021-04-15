import * as React from 'react'
import { ScreenProps } from '../../../types'
import TradingChart from '../../backtesting/btCharts/CanvasChart'

export default class BotDetailsScreen extends React.Component<ScreenProps> {
	render() {
		let { currentBackTesting } = this.props.store;
		if (!currentBackTesting) {
			return <div>Please run backtesting</div>;
		}
		let { orders, candles } = currentBackTesting;
		if (!candles) {
			return <div>Please run backtesting</div>;
		}

		return (
			<div style={{ width: '100%' }}>
				<TradingChart orders={orders} candles={candles} />
			</div>
		)
	}
}