import * as React from 'react'
import { ScreenProps } from '../../../types'
import TradingChart from '../../backtesting/btCharts/CanvasChart'

export default class BotDetailsScreen extends React.Component<ScreenProps> {
	render() {
		return (
			<div style={{ width: '100%' }}>
				<TradingChart />
			</div>
		)
	}
}