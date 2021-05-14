import * as React from 'react'
import { InputGroup } from '../../components';
import styles from './_BtSettings.module.css';

export interface Balances { [symbol: string]: string };

interface InitialBalancesProps {
	symbols: string[]
	balances: Balances
	onChange: (balances: Balances) => any
}

export default class InitialBalances extends React.Component<InitialBalancesProps> {
	render() {
		return (
			<div className={styles.fieldGroup}>
				<div className={styles.groupHeader}>
					Initial balances
				</div>
				{ this.props.symbols.map(this._renderBalanceInput)}
			</div>
		);
	}

	_renderBalanceInput = (symbol: string) => {
		return (
			<div className={styles.field}>
				<InputGroup
					name={`${symbol}_balance`}
					label={symbol}>
					<input name={`${symbol}_balance`}
						// @ts-ignore
						value={this.props.balances[symbol] || '0'}
						onChange={e => this.updateBalances(symbol, e.target.value)} />
				</InputGroup>
			</div>
		);
	}

	updateBalances(symbol: string, value: string) {
		this.props.onChange({
			...this.props.balances,
			[symbol]: value
		});
	}

	componentDidMount() {
		let balances: Balances = {};
		this.props.symbols.forEach( symbol => {
			balances[symbol] = this.props.balances[symbol] || '0'
		});
		this.props.onChange(balances);
	}
}
