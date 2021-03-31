import * as React from 'react';
import Button from './Button';
import InputGroup from './InputGroup';
interface BootToolsProps {
	onRun: (config: BacktestConfig) => void
}

export interface BacktestConfig {
	baseAssets: string[],
	quotedAsset: string,
	interval: string
	initialBalances: {[asset: string]: number}
	startDate: string
	endDate: string
	fees: number,
	slippage: number
}

const DAY = 24 * 60 * 60 * 1000;

export default class BootTools extends React.Component<BootToolsProps> {
	state = {
		baseAssets: 'BTC,ETH',
		quotedAsset: 'USD',
		interval: '1h',
		initialBalances: {
			USD: 1000
		},
		testingTimeframe : '7',
		startDate: this.getInputDate(Date.now() - 8 * DAY),
		endDate: this.getInputDate(Date.now() - DAY ),
		fees: '0.1%',
		slippage: '0.2%'
	}

	render() {
		return (
			<div style={ styles.wrapper }>
				{this.renderBotConfig()}
				{this.renderTestingTimeframe() }
				{this.renderInitialBalances() }
				{this.renderExtraConfig() }
				<div style={styles.fieldGroup}>
					<div style={styles.control}>
						<Button onClick={ this._onStartPressed }>Start backtesting</Button>
					</div>
				</div>
			</div>
		);
	}

	renderBotConfig() {
		return (
			<div style={styles.fieldGroup}>
				<div style={styles.groupHeader}>
					Bot config
					</div>
				<div style={styles.field}>
					<InputGroup
						name="baseAssets"
						label="Base assets">
						<input name="baseAssets"
							value={this.state.baseAssets}
							onChange={e => this.setState({ baseAssets: e.target.value })} />
					</InputGroup>
				</div>
				<div style={styles.field}>
					<InputGroup name="quotedAsset" label="Quoted asset">
						<input name="quotedAsset"
							value={this.state.quotedAsset}
							onChange={e => this.setState({ quotedAsset: e.target.value })} />
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
		);
	}

	renderTestingTimeframe() {
		return (
			<div style={styles.fieldGroup}>
				<div style={styles.groupHeader}>
					Testing time frame
				</div>
				<div style={styles.field}>
					<InputGroup name="interval" label="Data from">
						<select value={ this.state.testingTimeframe } onChange={ this._changeTimeframe }>
							<option value="1">Last day</option>
							<option value="3">Last 3 days</option>
							<option value="7">Last week</option>
							<option value="30">Last month</option>
							<option value="90">Last 3 months</option>
							<option value="180">Last 6 months</option>
							<option value="365">Last year</option>
							<option value="custom">Custom dates</option>
						</select>
					</InputGroup>
				</div>
				<div style={styles.field}>
					<InputGroup name="startDate" label="From">
						<input name="startDate"
							placeholder="yyyy-mm-dd"
							value={ this.state.startDate }
							onChange={ e => this.setState({startDate: e.target.value})} />
					</InputGroup>
				</div>
				<div style={styles.field}>
					<InputGroup name="endDate" label="To">
						<input name="endDate"
							placeholder="yyyy-mm-dd"
							value={ this.state.endDate }
							onChange={e => this.setState({ endDate: e.target.value })} />
					</InputGroup>
				</div>
			</div>
		);
	}

	renderExtraConfig(){
		return (
			<div style={styles.fieldGroup}>
				<div style={styles.groupHeader}>
					Extra configuration
				</div>
				<div style={styles.field}>
					<InputGroup name="fees" label="Fees">
						<input name="fees"
							value={ this.state.fees }
							onChange={ e => this.updatePercentage('fees', e.target.value) } />
					</InputGroup>
				</div>
				<div style={styles.field}>
					<InputGroup name="slippage" label="Slippage">
						<input name="slippage"
							value={this.state.slippage}
							onChange={e => this.updatePercentage('slippage', e.target.value)} />
					</InputGroup>
				</div>
			</div>
		)
	}

	updatePercentage( field: string, value: string){
		if( value[value.length - 1] !== '%'){
			this.setState({[field]: value + '%'});
		}
		else {
			this.setState({ [field]: value});
		}
	}

	_changeTimeframe = (e:any) => {
		let selected = e.target.value;
		if( selected === 'custom' ){
			this.setState({testingTimeframe: selected});
			return;
		}

		this.setState({
			testingTimeframe: selected,
			endDate: this.getInputDate( Date.now() - DAY ),
			startDate: this.getInputDate( Date.now() - (parseInt(selected) +1) * DAY )
		});
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

	_onStartPressed = () => {
		let errors = this.getValidationErrors();
		if( errors ){
			this.setState({errors});
		}

		this.props.onRun( this.getConfig() );
	}

	getValidationErrors() {
		return false;
	}

	getConfig(): BacktestConfig {
		let { 
			quotedAsset, interval, initialBalances,
			startDate, endDate, fees, slippage
		} = this.state;

		return {
			baseAssets: this.getSymbols().slice(1),
			quotedAsset,
			interval,
			initialBalances,
			startDate,
			endDate,
			fees: parseFloat(fees),
			slippage: parseFloat(slippage)
		};
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
		return this.state.quotedAsset;
	}

	getSymbols() {
		let symbols = [this.state.quotedAsset];
		this.state.baseAssets.split(/\s*,\s*/).forEach( symbol => {
			if( symbol.trim() ){
				symbols.push( symbol.trim() );
			}
		});
		return symbols;
	}

	getInputDate( time: number ){
		let date = new Date(time);
		return date.toISOString().split('T')[0];
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
	},
	control: {
		display: 'flex',
		flexGrow: 1,
		flexDirection: 'column',
		alignItems: 'stretch'
	}
}