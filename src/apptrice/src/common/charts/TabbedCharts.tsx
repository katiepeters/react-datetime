import memoizeOne from 'memoize-one';
import * as React from 'react'
import { DBBotDeployment, DeploymentOrders, Order } from '../../../../lambdas/model.types';
import { Tabs, Tab } from '../../components';
import AutoChart from './AutoChart';
import styles from './_TabbedCharts.module.css';

interface TabbedChartsProps {
	deployment: DBBotDeployment
}

export default class TabbedCharts extends React.Component<TabbedChartsProps> {
	state = {
		activeSymbol: this.props.deployment.symbols[0]
	}

	render() {
		const { symbols, exchange, runInterval, orders } = this.props.deployment;

		return (
			<div className={styles.container}>
				<div className={styles.tabs}>
					<Tabs active={this.state.activeSymbol}
						onChange={(activeSymbol: string) => this.setState({ activeSymbol })}>
						{symbols.map((symbol: string) => (
							<Tab id={symbol}>{symbol}</Tab>
						))}
					</Tabs>
				</div>
				<div className={styles.chart}>
					<AutoChart
						symbol={this.state.activeSymbol}
						exchange={exchange}
						interval={runInterval}
						orders={this.getActiveSymbolOrders(orders)}
					/>
				</div>
			</div>
		)
	}

	getActiveSymbolOrders(orders: DeploymentOrders ): Order[] {
		return getSymbolOrders( orders, this.state.activeSymbol );
	}
}

const getSymbolOrders = memoizeOne( (orders: DeploymentOrders, symbol: string ) => {
	return Object.values(orders.items).filter((order: Order) => (
		order.symbol === symbol
	));
});
