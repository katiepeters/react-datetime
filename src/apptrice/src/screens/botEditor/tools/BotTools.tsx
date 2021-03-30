import * as React from 'react';
import InputGroup from './InputGroup';

export default class BootTools extends React.Component {
	state = {
		baseSymbols: 'BTC,ETH',
		quotedSymbol: 'USD',
		interval: '1h',
		initialBalances: {
			USD: 1000
		}
	}
	render() {
		return (
			<div style={ styles.wrapper }>
				<div style={ styles.fieldGroup }>
					<div style={ styles.groupHeader}>
						Bot config
					</div>
					<div style={styles.field}>
						<InputGroup
							name="baseSymbols"
							label="Base symbols">
							<input name="baseSymbols"
								value={this.state.baseSymbols}
								onChange={e => this.setState({ baseSymbols: e.target.value })} />
						</InputGroup>
					</div>
					<div style={styles.field}>
						<InputGroup name="quotedSymbol" label="Quoted symbol">
							<input name="quotedSymbol"
								value={this.state.quotedSymbol}
								onChange={e => this.setState({ quotedSymbol: e.target.value })} />
						</InputGroup>
					</div>
					<InputGroup name="interval" label="Execution interval">
						<select name="interval"
							value={this.state.interval}
							onChange={e => this.setState({ interval: e.target.value })}>
							<option>5m</option>
							<option>10m</option>
							<option>30m</option>
							<option>1h</option>
							<option>4h</option>
							<option>1d</option>
						</select>
					</InputGroup>
				</div>
				{this.renderInitialBalances() }
			</div>
		);
	}

	renderTestingTimeframe() {
		return (
			<div style={styles.fieldGroup}>
				<div style={styles.groupHeader}>
					Testing timeframe
				</div>
				<select>
					<option value="1">1 day</option>
					<option value="3">3 days</option>
					<option value="7">1 week</option>
					<option value="30">1 month</option>
					<option value="90">3 months</option>
					<option value="180">6 months</option>
					<option value="365">1 year</option>
					<option value="custom">Custom dates</option>
				</select>
				{ this.getSymbols().map(this._renderBalanceInput)}
			</div>
		);

	}

	renderInitialBalances() {
		return (
			<div style={styles.fieldGroup}>
				<div style={styles.groupHeader}>
					Initial balances
				</div>
				{ this.getSymbols().map( this._renderBalanceInput ) }
			</div>
		);
	}

	_renderBalanceInput = (symbol:string) => {
		return (
			<div style={styles.field}>
				<InputGroup
					name={`${symbol}_balance`}
					label={symbol}>
					<input name={`${symbol}_balance`}
						// @ts-ignore
						value={this.state.initialBalances[symbol] || 0}
						onChange={e => this.updateInitialBalance(symbol, e.target.value)} />
				</InputGroup>
			</div>
		);
	}

	updateInitialBalance( symbol:string, value: string ){
		this.setState({
			initialBalances: {
				...this.state.initialBalances,
				[symbol]: value
			}
		});
	}

	getQuotedSymbol(){
		return this.state.quotedSymbol;
	}

	getSymbols() {
		let symbols = [this.state.quotedSymbol];
		this.state.baseSymbols.split(/\s*,\s*/).forEach( symbol => {
			console.log( symbol );
			if( symbol.trim() ){
				symbols.push( symbol.trim() );
			}
		});
		return symbols;
	}
}

const styles: { [id: string]: React.CSSProperties } = {
	wrapper: {
		width: '100%'
	},
	fieldGroup: {
		padding: '0 8px',
		marginBottom: 24
	},
	groupHeader: {
		borderBottom: '1px solid rgba(255,255,255,.1)',
		marginBottom: 8
	},
	field: {
		marginBottom: 8
	}
}