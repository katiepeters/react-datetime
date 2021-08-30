import * as React from 'react'
import { DeploymentOrders } from '../../../../../lambdas/model.types';
import OrderList from '../../../common/orderList/OrderList';
import { Card, ScreenWrapper } from '../../../components';
import { SingleDeploymentScreenProps } from '../SingleDeploymentScreenProps';
// import styles from './_DeploymentOrdersScreen.module.css';

export default class DeploymentOrdersScreen extends React.Component<SingleDeploymentScreenProps> {
	render() {
		const {orders} = this.props.deployment;
		
		return (
			<ScreenWrapper title={this.renderTitle(orders)}>
				{ this.renderList(orders) }
			</ScreenWrapper>
		)
	}

	renderList(orders: DeploymentOrders) {
		if( !Object.keys(orders).length ){
			return <Card>No orders.</Card>;
		}

		return (
			<OrderList
				orders={orders.items} />
		);
	}

	renderTitle(orders: DeploymentOrders) {
		let count = Object.keys(orders).length;
		return count ?
			`${count} orders` :
			'Orders'
		;
	}
}
