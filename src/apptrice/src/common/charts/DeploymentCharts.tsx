import memoizeOne from 'memoize-one';
import * as React from 'react'
import { DeploymentOrders, Order, RunnableDeployment } from '../../../../lambdas/model.types';
import { Tabs, Tab } from '../../components';
import AutoChart from './AutoChart';
import styles from './_DeploymentCharts.module.css';

interface DeploymentChartsProps {
	deployment: RunnableDeployment,
	exchangeProvider: 'bitfinex',
	selector?: 'tabs' | 'dropdown',
	activePair?: string,
	onChange?: (activePair: string) => any
}

export default class DeploymentCharts extends React.Component<DeploymentChartsProps> {
	state = {
		activePair: this.props.deployment.pairs[0]
	}

	render() {
		const { runInterval, orders, plotterData, activeIntervals, lastRunAt } = this.props.deployment;
		const exchange = this.props.exchangeProvider;

		return (
			<div className={styles.container}>
				<div className={styles.tabs}>
					{ this.renderSelector() }
				</div>
				<div className={styles.chart}>
					<AutoChart
						pair={this.state.activePair}
						exchange={exchange}
						interval={runInterval}
						startDate={ activeIntervals[0][0]}
						endDate={ lastRunAt || Date.now() }
						orders={this.getActivePairOrders(orders)}
						indicators={ plotterData.indicators }
						patterns={plotterData.candlestickPatterns}
					/>
				</div>
			</div>
		)
	}

	renderSelector() {
		const { deployment, selector } = this.props;
		
		if( selector === 'dropdown' ){
			return (
				<select value={this.state.activePair}
					onChange={ (e:React.ChangeEvent<HTMLSelectElement>) => this._onChange(e.target.value)}>
					{deployment.pairs.map((pair: string) => (
						<option key={pair} value={pair}>{pair}</option>
					))}
					</select>
			)
		}
		else {
			return (
				<Tabs active={this.state.activePair}
					onChange={ this._onChange }>
					{deployment.pairs.map((pair: string) => (
						<Tab key={pair} id={pair}>{pair}</Tab>
					))}
				</Tabs>
			);
		}
	}

	getActivePairOrders(orders: DeploymentOrders ): Order[] {
		return getPairOrders( orders, this.state.activePair );
	}

	getActivePair(){
		return this.props.activePair || this.state.activePair;
	}

	_onChange = (activePair: string) => {
		if( this.props.onChange ){
			this.props.onChange(activePair);
		}
		else {
			this.setState({ activePair });
		}
	}

}

const getPairOrders = memoizeOne( (orders: DeploymentOrders, pair: string ) => {
	return Object.values(orders.items).filter((order: Order) => (
		order.pair === pair
	));
});
