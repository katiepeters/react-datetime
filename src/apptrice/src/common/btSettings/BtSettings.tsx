import * as React from 'react'
import { InputGroup, Button } from '../../components';
import { BacktestConfig } from './BotTools';
import { getBtConfig, BtSettingsConfig, saveBtConfig } from './BtConfigStore';
import InitialBalances from './InitialBalances';
import styles from './_BtSettings.module.css';

interface BtSettingsProps {
	botId: string
	isRunning: boolean
	onRun: (config: BacktestConfig) => any
	onAbort: () => any
}

interface BtSettingsState extends BtSettingsConfig {
	errors: {[key: string]: string}
}

const DAY = 24 * 60 * 60 * 1000;

export default class BtSettings extends React.Component<BtSettingsProps, BtSettingsState> {
	state = {
		...this.getLastBotConfig(),
		errors: {}
	}

	render() {
		return (
			<div className={styles.wrapper}>
				{this.renderBotConfig()}
				{this.renderTestingTimeframe()}
				{this.renderInitialBalances()}
				{this.renderExtraConfig()}
				<div className={styles.fieldGroup}>
					<div className={styles.control}>
						{this.renderButton()}
					</div>
				</div>
			</div>
		);
	}

	renderBotConfig() {
		return (
			<div className={styles.fieldGroup}>
				<div className={styles.groupHeader}>
					Bot config
					</div>
				<div className={styles.field}>
					<InputGroup
						name="baseAssets"
						label="Base assets">
						<input name="baseAssets"
							value={this.state.baseAssets}
							onChange={ this._updateBaseAssets } />
					</InputGroup>
				</div>
				<div className={styles.field}>
					<InputGroup name="quotedAsset" label="Quoted asset">
						<input name="quotedAsset"
							value={this.state.quotedAsset}
							onChange={e => this.setState({ quotedAsset: e.target.value.toUpperCase() })} />
					</InputGroup>
				</div>
				<InputGroup name="runInterval" label="Execution runInterval">
					<select name="runInterval"
						value={this.state.runInterval}
						// @ts-ignore
						onChange={e => this.setState({ runInterval: e.target.value })}>
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
			<div className={styles.fieldGroup}>
				<div className={styles.groupHeader}>
					Testing time frame
				</div>
				<div className={styles.field}>
					<InputGroup name="runInterval" label="Data from">
						<select value={this.state.testingTimeframe} onChange={this._changeTimeframe}>
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
				<div className={styles.field}>
					<InputGroup name="startDate" label="From">
						<input name="startDate"
							placeholder="yyyy-mm-dd"
							value={this.state.startDate}
							onChange={e => this.setState({ startDate: e.target.value })} />
					</InputGroup>
				</div>
				<div className={styles.field}>
					<InputGroup name="endDate" label="To">
						<input name="endDate"
							placeholder="yyyy-mm-dd"
							value={this.state.endDate}
							onChange={e => this.setState({ endDate: e.target.value })} />
					</InputGroup>
				</div>
			</div>
		);
	}

	renderExtraConfig() {
		return (
			<div className={styles.fieldGroup}>
				<div className={styles.groupHeader}>
					Extra configuration
				</div>
				<div className={styles.field}>
					<InputGroup name="fees" label="Fees">
						<input name="fees"
							value={this.state.fees}
							onChange={e => this.updatePercentage('fees', e.target.value)} />
					</InputGroup>
				</div>
				<div className={styles.field}>
					<InputGroup name="slippage" label="Slippage">
						<input name="slippage"
							value={this.state.slippage}
							onChange={e => this.updatePercentage('slippage', e.target.value)} />
					</InputGroup>
				</div>
			</div>
		)
	}

	renderButton() {
		if ( this.props.isRunning ) {
			return (
				<Button onClick={this._onAbortBT}>
					Abort
				</Button>
			);
		}
		return (
			<Button onClick={this._onStartPressed}>
				Start backtesting
			</Button>
		)
	}

	updatePercentage(field: 'fees' | 'slippage', value: string) {
		if (value[value.length - 1] !== '%') {
			// @ts-ignore
			this.setState({ [field]: value + '%' });
		}
		else {
			// @ts-ignore
			this.setState({ [field]: value });
		}
	}

	_changeTimeframe = (e: any) => {
		let selected = e.target.value;
		if (selected === 'custom') {
			this.setState({ testingTimeframe: selected });
			return;
		}

		this.setState({
			testingTimeframe: selected,
			endDate: this.getInputDate(Date.now() - DAY),
			startDate: this.getInputDate(Date.now() - (parseInt(selected) + 1) * DAY)
		});
	}

	renderInitialBalances() {
		return (
			<InitialBalances
				symbols={ this.getSymbols() }
				balances={ this.state.initialBalances }
				onChange={initialBalances => this.setState({initialBalances})}
				innerPadding />
		);
	}

	_onStartPressed = () => {
		let errors = this.getValidationErrors();
		if (errors) {
			this.setState({ errors });
		}

		let state: any = { ...this.state };
		delete state.errors;
		saveBtConfig(this.props.botId, state);
		this.props.onRun(this.getConfig());
	}

	_onAbortBT = () => {
		this.props.onAbort();
	}

	_updateBaseAssets = (e:React.ChangeEvent<HTMLInputElement>) => {
		this.setState({baseAssets: e.target.value.toUpperCase()});
	}

	getValidationErrors() {
		return {};
	}

	getConfig(): BacktestConfig {
		let {
			quotedAsset, runInterval, initialBalances,
			startDate, endDate, fees, slippage
		} = this.state;

		const start = new Date(startDate + 'T00:00:00.000Z');
		const end = new Date(endDate + 'T23:59:59.999Z');
		const baseAssets = this.getSymbols().slice(1);

		let balances:{[asset:string]: number} = {
			[quotedAsset]: initialBalances[quotedAsset] || 0
		};
		baseAssets.forEach( asset => {
			balances[asset] = initialBalances[asset] || 0
		});

		return {
			baseAssets,
			quotedAsset,
			runInterval,
			initialBalances: balances,
			startDate: start.getTime(),
			endDate: end.getTime(),
			fees: parseFloat(fees),
			slippage: parseFloat(slippage)
		};
	}

	getQuotedSymbol() {
		return this.state.quotedAsset;
	}

	getSymbols() {
		let symbols = [this.state.quotedAsset];
		this.state.baseAssets.split(/\s*,\s*/).forEach(symbol => {
			if (symbol.trim()) {
				symbols.push(symbol.trim());
			}
		});
		return symbols;
	}

	getInputDate(time: number) {
		let date = new Date(time);
		return date.toISOString().split('T')[0];
	}

	getLastBotConfig(): BtSettingsConfig {
		let config = getBtConfig( this.props.botId ) || this.getDefaultConfig();

		if( config.testingTimeframe !== 'custom' ){
			config.startDate = this.getInputDate( Date.now() - parseInt(config.testingTimeframe) * DAY);
			config.endDate = this.getInputDate(Date.now() - DAY);
		}

		return config;
	}

	getDefaultConfig(): BtSettingsConfig {
		const DAY = 24 * 60 * 60 * 1000;

		return {
			baseAssets: 'BTC,ETH',
			quotedAsset: 'USD',
			runInterval: '1h',
			initialBalances: {
				USD: 1000
			},
			testingTimeframe: '7',
			startDate: this.getInputDate(Date.now() - 8 * DAY),
			endDate: this.getInputDate(Date.now() - DAY),
			fees: '0.1%',
			slippage: '0.2%'
		};
	}
}
