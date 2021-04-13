import * as React from 'react'
import { ScreenProps } from '../../types'
import TradingChart from './btCharts/CanvasChart'

export default class BtDetailsScreen extends React.Component<ScreenProps> {
	render() {
		return (
			<div style={{width: '100%'}}>
				<TradingChart />
			</div>
		)
	}
}
