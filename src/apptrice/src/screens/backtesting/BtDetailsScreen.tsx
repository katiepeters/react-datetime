import * as React from 'react'
import { ScreenProps } from '../../types'
import TradingChart from './btCharts/TradingChart'

export default class BtDetailsScreen extends React.Component<ScreenProps> {
	render() {
		let {store, quickStore} = this.props;

		if ( !store.currentBackTesting?.candles ) {
			return <div>Please run backtesting</div>;
		}

		return (
			<div style={{width: '100%'}}>
				<TradingChart 
					orders={ quickStore.getOrders() }
					candles={store.currentBackTesting?.candles} />
			</div>
		);
	}
}
