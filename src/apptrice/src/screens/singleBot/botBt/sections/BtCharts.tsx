import memoizeOne from 'memoize-one';
import * as React from 'react'
import { Orders } from '../../../../../../lambdas/lambda.types';
import { DeploymentOrders, Order } from '../../../../../../lambdas/model.types';
import arrayize from '../../../../../../lambdas/_common/utils/arrayize';
import DeploymentCharts from '../../../../common/charts/DeploymentCharts';
import OrderList from '../../../../common/orderList/OrderList';
import { ScreenProps } from '../../../../types'
import { BtActive } from '../../../../utils/backtest/Bt.types';
// import styles from './_BtCharts.module.css';

interface BtChartsProps extends ScreenProps {
	bt: BtActive
}

export default class BtCharts extends React.Component<BtChartsProps> {
	state = {
		activePair: this.props.bt.data.deployment.pairs[0]
	}

	render() {
		let { exchange, deployment } = this.props.bt.data;
		return (
			<div>
				<DeploymentCharts
					selector="dropdown"
					exchangeProvider={ exchange.provider }
					deployment={ deployment }
					activePair={ this.state.activePair }
					onChange={ (activePair: string) => this.setState({activePair}) } />
				<OrderList orders={ this.getOrders() } />
			</div>
		)
	}

	getOrders() {
		return memoOrders( this.props.bt.data.deployment.orders, this.state.activePair );
	}
}


const memoOrders = memoizeOne( (allOrders: DeploymentOrders, activePair: string ): Orders => {
	return arrayize<Order>( allOrders.items ).filter( (it: Order) => (
		it.pair === activePair
	));
});