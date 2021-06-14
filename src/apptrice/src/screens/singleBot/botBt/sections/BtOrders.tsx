import memoizeOne from 'memoize-one';
import * as React from 'react'
import { DeploymentOrders } from '../../../../../../lambdas/model.types';
import OrderList from '../../../../common/orderList/OrderList';
import { Card } from '../../../../components';
import { BtSectionProps } from '../../../../utils/Bt.types'
import styles from './_BtOrders.module.css';

export default class BtOrders extends React.Component<BtSectionProps> {
	render() {
		const { data } = this.props.bt;
		const orders = getOrders( data.deployment.orders );
		const count = Object.keys(orders).length;

		if( !count ){
			return <Card>No orders.</Card>;
		}

		return (
			<div className={styles.container}>
				<h3>{count} orders</h3>
				<div className={styles.orders}>
					<OrderList orders={orders} />
				</div>
			</div>
		);
	}
}

const getOrders = memoizeOne( (orders: DeploymentOrders) => {
		if( !orders ) return;
		return orders.items.flatten ?
			// @ts-ignore
			orders.items.flatten() : 
			orders.items
		;
})