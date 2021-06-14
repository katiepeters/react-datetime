import * as React from 'react'
import { Orders } from '../../../../lambdas/lambda.types';
import { DynamicList } from '../../components';
import OrderItem from './OrderItem';
import styles from './_OrderList.module.css';

interface OrderListProps {
	orders: Orders
}

export default class OrderList extends React.Component<OrderListProps> {
	render() {
		return (
			<DynamicList
				items={Object.keys(this.props.orders)}
				defaultSize={48}
				renderItem={this._renderOrder} />
		)
	}

	_renderOrder = (id: string) => {
		return (
			<OrderItem
				key={id}
				order={this.props.orders[id]} />
		);
	}
}
