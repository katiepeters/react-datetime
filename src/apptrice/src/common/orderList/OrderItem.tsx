import * as React from 'react'
import { Order } from '../../../../lambdas/model.types';
import { ExchangeOrder } from '../../../../lambdas/_common/exchanges/ExchangeAdapter';
import styles from './_OrderItem.module.css';

interface OrderItemProps {
	order: Order
}

export default class OrderItem extends React.PureComponent<OrderItemProps> {
	render() {
		let { order } = this.props;

		return (
			<div className={styles.row}>
				{ this.renderSymbolColor(order) }
				{ this.renderSymbolAndId(order) }
				{ this.renderDirectionAndType(order) }
				{ this.renderPlacedAt(order) }
				{ this.renderAmount(order) }
				{ this.renderPrice(order) }
				{ this.renderStatus(order)}
			</div>
		);
		/*
		return (
			<tr className={styles.row}>
				<td className={`${styles.cell} ${styles.column_id}`}>
					<div className={styles.mainInfo}>
						{this.renderDirection(order)}  #{order.id.slice(0, 6)}
					</div>
					<div className={styles.secondaryInfo}>
						{this.formatDate(order.placedAt)}
					</div>
				</td>
				<td className={`${styles.cell} ${styles.column_symbol}`}>
					{this.renderSymbol(order.symbol)}
				</td>
				<td className={`${styles.cell} ${styles.column_type}`}>
					<div className={styles.mainInfo}>
						{this.renderType(order.type)}
					</div>
					<div className={styles.secondaryInfo}>
						@ {order.executedPrice || order.price}
					</div>
				</td>
				{ this.renderStatus(order)}
			</tr>
		);*/
	}

	renderSymbolColor(order: Order){
		return (
			<div className={styles.colorWrapper}>
				<div className={styles.dot}
					style={{background: getSymbolColor(order.symbol)}} />
			</div>
		);
	}

	renderSymbolAndId( order: Order ){
		return (
			<div className={`${styles.cell} ${styles.column_symbol}`}>
				<div className={styles.mainInfo}>
					{order.symbol}
				</div>
				<div className={styles.secondaryInfo}>
					#{order.id.slice(0, 6)}
				</div>
			</div>
		)
	}

	renderDirectionAndType( order: Order ){
		return (
			<div className={`${styles.cell} ${styles.column_direction}`}>
				<div className={`${styles.mainInfo} ${styles[`direction_${order.direction}`]}`}>
					{order.direction}
				</div>
				<div className={styles.secondaryInfo}>
					{order.type}
				</div>
			</div>
		)
	}
	
	renderPlacedAt(order: Order){
		const date = this.formatDate( order.placedAt || order.createdAt );
		if( !date ) return;
		const dateParts = date.split(' ');
		return (
			<div className={`${styles.cell} ${styles.column_created}`}>
				<div className={`${styles.mainInfo}`}>
					{dateParts[0]}
				</div>
				<div className={styles.secondaryInfo}>
					{dateParts[1]}
				</div>
			</div>
		)	
	}


	renderAmount( order: Order ) {
		const amount = order.amount;
		const value = order.amount * (order.price || order.marketPrice);
		const assets = order.symbol.split('/');

		return (
			<div className={`${styles.cell} ${styles.column_amount}`}>
				<div className={`${styles.mainInfo}`}>
					{ formatPrice(amount) } { assets[0] }
				</div>
				<div className={styles.secondaryInfo}>
					{ formatPrice(value) } { assets[1] }
				</div>
			</div>
		)	
	}

	renderPrice( order: Order ) {
		return (
			<div className={`${styles.cell} ${styles.column_price}`}>
				<div className={`${styles.mainInfo}`}>
					{formatPrice(order.price || order.marketPrice)}
				</div>
			</div>
		);
	}

	formatDate(dt: number | null) {
		if (!dt) return;

		let str = (new Date(dt)).toISOString();
		return str.split('.')[0].replace('T', ' ');
	}

	renderStatus(order: Order) {
		return (
			<td className={`${styles.cell} ${styles.column_status}`}>
				<div className={styles.mainInfo}>
					<span className={ styles['status_' + order.status]}>
						{order.status}
					</span>
				</div>
				<div className={styles.secondaryInfo}>
					{this.formatDate(order.closedAt)}
				</div>
			</td>
		)
	}
}



const COLORS = [
	'blue',
	'yellow',
	'magenta',
	'darkcyan',
	'aqua',
	'cornsilk',
	'pink',
	'gold',
	'lightgreen',
	'mintcream'
];

let colorIndex: number = 0;
let symbolColors: { [symbol: string]: string } = {};
function getSymbolColor(symbol: string) {
	let color = symbolColors[symbol];
	if (!color) {
		color = COLORS[colorIndex];
		colorIndex += 1;
		symbolColors[symbol] = color;
	}
	return color;
}

function formatPrice( price: number ){
	return price.toString().slice(0, 9);
}