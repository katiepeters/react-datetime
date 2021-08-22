import * as React from 'react'
import { DeploymentStats } from './statsCalculator';
import styles from './_StatTable.module.css';

interface StatTableColumn {
	id: string,
	header: string,
	stats: DeploymentStats
}

interface StatTableProps {
	columns: StatTableColumn[],
	currency: string
}

const rows = [
	'initialValue',
	'finalValue',
	'netProfitPercent',
	'maxDropdownPercent',
	'maxValue',
	'minValue',
	'exposurePercent',
	'ordersCount',
	'completedOrdersCount',
	'openOrdersCount',
	'errorOrdersCount',
	'cancelledOrdersCount'
]

export default class StatTable extends React.PureComponent<StatTableProps> {
	render() {
		return (
			<table className={styles.table}>
				{ this.renderHeader() }
				{ this.renderRows() }
			</table>
		)
	}

	renderHeader() {
		return (
			<thead>
				<th className={styles.statNameHeader}>Statistics</th>
				{ this.props.columns.map( column => (
					<th key={column.id} className={styles.valueCell}>{ column.header }</th>
				))}
			</thead>
		)
	}

	renderRows() {
		return (
			<tbody className={styles.tbody}>
				{ rows.map( this._renderRow )}
			</tbody>
		)
	}

	_renderRow = ( statName: string ) => {
		return (
			<tr key={statName} className={ this.getRowCn(statName) }>
				<td className={styles.statNameValue}>{ this.getStatName(statName) }</td>
				{ this.props.columns.map( c => (
					<td key={c.id} className={styles.valueCell}>
						{ /* @ts-ignore */ }
						{ this.renderValue(statName, c.stats[statName]) }
					</td> 
				))}
			</tr>
		)
	}

	renderValue( statName: string, value: any ){
		switch( statName ){
			case 'initialValue':
			case 'finalValue':
			case 'minValue':
			case 'maxValue':
				return truncate(value, 2) + ' ' + this.props.currency;
			case 'netProfitPercent':
			case 'maxDropdownPercent':
			case 'exposurePercent':
				return truncate(value, 2) + ' %'
			default:
				return truncate(value, 2);
		}
	}

	getRowCn( statName: string ){
		return '';
	}

	getStatName( statName: string ){
		switch( statName ){
			case 'initialValue':
				return 'Initial value'
			case 'finalValue':
				return 'Final value'
			case 'netProfitPercent':
				return 'Net profit %'
			case 'maxDropdownPercent':
				return 'Max dropdown %'
			case 'maxValue':
				return 'Max value'
			case 'minValue':
				return 'Min value'
			case 'exposurePercent':
				return 'Exposure %'
			case 'ordersCount':
				return 'Orders count'
			case 'completedOrdersCount':
				return 'Completed orders'
			case 'errorOrdersCount':
				return 'Error orders'
			case 'openOrdersCount':
				return 'Open orders'
			case 'cancelledOrdersCount':
				return 'Cancelled orders'
			default:
				return ''
		}
	}
}


function truncate( n: number, decimals: number ): string{
	let parts = n.toString().split('.');
	if( parts[1] ){
		parts[1] = parts[1].slice(0,decimals);
	}
	return parts.join('.');
}