import * as React from 'react'
import { DynamicList } from '../../../components';
import { ScreenProps } from '../../../types';
import BtOrderItem from './BtOrderItem';

export default class BtOrdersScreen extends React.Component<ScreenProps> {
	render() {
		let {currentBackTesting} = this.props.store;
		if( !currentBackTesting ){
			return this.renderNoSelected();
		}

		let orders = Object.keys(this.props.quickStore.getOrders());
		return (
			<div style={styles.wrapper}>
				<h3>{orders.length} orders</h3>
				<DynamicList
					items={ orders }
					defaultSize={47}
					renderItem={ this._renderOrder } />
			</div>
		);
	}

	renderNoSelected() {
		return (
			<div>Please run backtesting</div>
		);
	}

	_renderOrder = (id:string) =>  {
		return (
			<BtOrderItem
				key={id}
				order={this.props.quickStore.getOrders()[id]} />
		);
	}
}

const styles: { [id: string]: React.CSSProperties } = {
	wrapper: {
		flex: 1,
		padding: '0 20px',
		height: '100vh',
		overflow: 'auto'
	}
}