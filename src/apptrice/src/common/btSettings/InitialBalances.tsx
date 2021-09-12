import * as React from 'react'
import { Card, InputGroup } from '../../components';
import styles from './_BtSettings.module.css';

export interface Balances { [pair: string]: string };

interface InitialBalancesProps {
	pairs: string[]
	balances: Balances
	onChange: (balances: Balances) => any
	innerPadding?: boolean
}

export default class InitialBalances extends React.Component<InitialBalancesProps> {
	render() {
		console.log('Inner padding', this.props)
		let cn = this.props.innerPadding ?
			styles.fieldGroup :
			''
		;

		return (
			<div className={cn}>
				<div className={styles.groupHeader}>
					Initial balances
				</div>
				{ this.renderPairs() }
			</div>
		);
	}

	renderPairs(){
		const {pairs} = this.props;
		if( !pairs.length ){
			return <Card>Select assets first.</Card>
		}
		return this.props.pairs.map(this._renderBalanceInput);
	}

	_renderBalanceInput = (pair: string) => {

		return (
			<div className={styles.field}>
				<InputGroup
					name={`${pair}_balance`}
					label={pair}>
					<input name={`${pair}_balance`}
						// @ts-ignore
						value={this.props.balances[pair]}
						onChange={e => this.updateBalances(pair, e.target.value)} />
				</InputGroup>
			</div>
		);
	}

	updateBalances(pair: string, value: string) {
		let parsed = value.replace(/[^\d.]/ig, '');
		this.props.onChange({
			...this.props.balances,
			[pair]: parsed
		});
	}

	componentDidMount() {
		let balances: Balances = {};
		this.props.pairs.forEach( pair => {
			balances[pair] = this.props.balances[pair] || '0'
		});
		this.props.onChange(balances);
	}
}
