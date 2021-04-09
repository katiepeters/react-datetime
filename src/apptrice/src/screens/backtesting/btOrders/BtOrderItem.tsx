import * as React from 'react'
import { ExchangeOrder } from '../../../../../lambdas/_common/exchanges/ExchangeAdapter'
import styles from './_BtOrderItem.module.css';

interface BtOrderItemProps {
	order: ExchangeOrder
}

export default class BtOrderItem extends React.PureComponent<BtOrderItemProps> {
	render() {
		let {order} = this.props;

		return (
			<tr className={styles.row}>
				<td className={`${styles.cell} ${styles.column_id}`}>
					<div className={styles.mainInfo}>
						{this.renderDirection(order)}  #{order.id.slice(0, 6)}
					</div>
					<div className={styles.secondaryInfo}>
						{ this.renderDate(order.placedAt) }
					</div>
				</td>
				<td className={`${styles.cell} ${styles.column_symbol}`}>
					{this.renderSymbol(order.symbol)}
				</td>
				<td className={`${styles.cell} ${styles.column_type}`}>
					<div className={styles.mainInfo}>
						{ this.renderType(order.type) }
					</div>
					<div className={styles.secondaryInfo}>
						@ {order.executedPrice || order.price}
					</div>
				</td>
				{ this.renderStatus(order) }
			</tr>
		);
	}

	renderDirection( {direction}: ExchangeOrder ) {
		return (
			<span className={`${styles.label} ${styles['direction_' + direction]}`}>
				{direction}
			</span>
		);
	}

	renderSymbol( symbol: string ){
		return (
			<span className={styles.label}
				style={{background: getSymbolColor(symbol)}}>
					{symbol}
			</span>
		);
	}

	renderDate( dt:number|null ){
		if (!dt) return;

		let str = (new Date(dt)).toISOString();
		return str.split('.')[0].replace('T', ' ');
	}

	renderType( type: string ){
		return (
			<span className={`${styles.label} ${styles['type_' + type]}`}>
				{type}
			</span>
		)
	}

	renderStatus( order: ExchangeOrder ){
		return (
			<td className={`${styles.cell} ${styles.column_status}`}>
				<div className={styles.mainInfo}>
					<span className={`${styles.label} ${styles['status_' + order.status]}`}>
						{order.status}
					</span>
				</div>
				<div className={styles.secondaryInfo}>
					{ this.renderDate(order.closedAt) }
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
let symbolColors: { [symbol: string]: string } = { };
function getSymbolColor(symbol: string){
	let color = symbolColors[symbol];
	if (!color) {
		color = COLORS[colorIndex];
		colorIndex += 1;
		symbolColors[symbol] = color;
	}
	return color;
}