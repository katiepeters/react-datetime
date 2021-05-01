import * as React from 'react'
import { ScreenProps } from '../../../types'
import styles from './BtChartsScreen.module.css';
import TradingChart from './TradingChart';

export default class BtChartsScreen extends React.Component<ScreenProps> {
	render() {
		let {store, quickStore} = this.props;

		if ( !store.currentBackTesting?.candles ) {
			return <div>Please run backtesting</div>;
		}

		return (
			<div className={styles.container}>
				<TradingChart 
					orders={ quickStore.getOrders() }
					candles={store.currentBackTesting?.candles} />
			</div>
		);
	}
}
