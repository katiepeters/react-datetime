import * as React from 'react'
import { Orders } from '../../../../../lambdas/lambda.types';
import { DBBotDeployment } from '../../../../../lambdas/model.types';
import OrderList from '../../../common/orderList/OrderList';
import { Card, ScreenWrapper } from '../../../components';
import { ScreenProps } from '../../../types';
import deploymentLoader from '../deployment.loader';
import styles from './_DeploymentOrdersScreen.module.css';

export default class DeploymentOrdersScreen extends React.Component<ScreenProps> {
	render() {
		let { data: deployment } = deploymentLoader.getData(this.getDeploymentId())
		let orders = this.getOrders( deployment );
		return (
			<ScreenWrapper title={this.renderTitle(orders)}>
				{ this.renderList(orders) }
			</ScreenWrapper>
		)
	}

	renderList(orders?: Orders) {
		if( !orders ){
			return <Card>Loading...</Card>;
		}

		if( !Object.keys(orders).length ){
			return <Card>No orders.</Card>;
		}

		return (
			<OrderList
				orders={orders} />
		);
	}

	renderTitle(orders?: Orders) {
		if (!orders) {
			return 'Orders'
		}

		let count = Object.keys(orders).length;
		return count ?
			`${count} orders` :
			'Orders'
		;
	}

	getDeploymentId() {
		return this.props.router.location.params.id;
	}

	getOrders(deployment?: DBBotDeployment): Orders | undefined {
		if( !deployment ) return;
		let {items} = deployment.orders;
		// @ts-ignore
		return items.flatten ? items.flatten() : items;
	}
}
