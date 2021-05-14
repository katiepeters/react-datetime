import * as React from 'react'
import { DbExchangeAccount } from '../../../../lambdas/model.types';
import InitialBalances, {Balances} from '../../common/btSettings/InitialBalances';
import { Button, Controls, InputGroup } from '../../components';
import Toaster from '../../components/toaster/Toaster';
import { DbBot } from '../../state/apiCacher';
import exchangeListLoader from '../../state/loaders/exchangeList.loader';
import { FormErrors } from '../../types';
import botListLoader from '../bots/botList.loader';
import styles from './_CreateDeploymentForm.module.css';

export interface CreateDeploymentPayload {
	accountId: string
	botId: string
	exchangeAccountId: string
	runInterval: string
	symbols: string[]
	active: boolean
}

interface CreateDeploymentFormProps {
	accountId: string
	onClose: () => any
	onCreate: (exchange: CreateDeploymentPayload) => Promise<any>
}

interface CreateDeploymentState {
	botId: string,
	exchangeAccountId: string,
	runInterval: string,
	baseAssets: string,
	quotedAsset: string,
	errors: FormErrors,
	creating: boolean
	exchange: string
	initialBalances: Balances
}

export default class CreateDeploymentForm extends React.Component<CreateDeploymentFormProps> {
	state: CreateDeploymentState = {
		botId: '',
		exchangeAccountId: '',
		runInterval: '1h',
		baseAssets: '',
		quotedAsset: '',
		errors: {},
		creating: false,
		exchange: 'bitfinex',
		initialBalances: {}
	}

	dataLoaded = false;
	render() {
		let {accountId} = this.props;
		let { data: bots } = botListLoader.getData(this, accountId);
		let { data: exchanges } = exchangeListLoader.getData(this, accountId);

		if( !bots || !exchanges ){
			return <span>Loading...</span>;
		} 
		if( !this.dataLoaded ){
			this.dataLoaded = true;
		}

		return (
			<div className={styles.container}>
				<div className={styles.titleWrapper}>
					<h3>Launch a bot</h3>
				</div>
				<div className={styles.inputWrapper}>
					<InputGroup
						name="botId"
						label="Select a bot">
							{ this.renderBotSelector(bots) }
					</InputGroup>
				</div>

				<div className={styles.inputWrapper}>
					<InputGroup
						name="runInterval"
						label="Run interval">
							<select name="runInterval"
								value={this.state.runInterval}
								onChange={e => this.setState({ runInterval: e.target.value })}>
									<option value="1h">Every hour</option>
							</select>
					</InputGroup>
				</div>

				<div className={styles.inputWrapper}>
					<InputGroup
						name="baseAssets"
						label="Target assets to trade"
						caption={ this.state.errors.baseAssets }>
						<input name="baseAssets"
							value={this.state.baseAssets}
							onChange={e => this.setState({ baseAssets: e.target.value })} />
					</InputGroup>
				</div>

				<div className={styles.inputWrapper}>
					<InputGroup
						name="quotedAsset"
						label="Base asset"
						caption={ this.state.errors.quotedAsset }>
						<input name="quotedAsset"
							value={this.state.quotedAsset}
							onChange={e => this.setState({ quotedAsset: e.target.value })} />
					</InputGroup>
				</div>

				<div className={styles.inputWrapper}>
					<InputGroup
						name="botId"
						label="Select a exchange account">
						{this.renderExchangeSelector(exchanges)}
					</InputGroup>
				</div>

				{ this.renderVirtualExchangeOptions()}

				<Controls>
					<Button size="s"
						color="transparent"
						onClick={ this.props.onClose }
						disabled={ this.state.creating }>
						Cancel
					</Button>
					<Button size="s"
						onClick={this._onCreate}
						loading={this.state.creating}>
						Deploy the bot
					</Button>
				</Controls>
			</div>
		)
	}

	renderBotSelector( bots: DbBot[] ) {
		let options = bots.map((bot: DbBot ) => (
			<option key={bot.id} value={bot.id}>{bot.name}</option>
		));

		return (
			<select name="botId"
				value={this.state.botId}
				onChange={e => this.setState({ botId: e.target.value })}>
				{ options }
			</select>
		);
	}

	renderExchangeSelector( exchanges: DbExchangeAccount[] ){
		let options: any[] = [];

		exchanges.forEach((exchange: DbExchangeAccount) => {
			if (exchange.type === 'real' ){
				options.push(
					<option key={exchange.id} value={exchange.id}>{exchange.name}</option>
				);
			}
		});

		options.push(
			<option key="virtual" value="virtual">Virtual exchange</option>
		);

		return (
			<select name="exchangeAccountId"
				value={this.state.exchangeAccountId}
				onChange={e => this.setState({ exchangeAccountId: e.target.value })}>
				{ options }
			</select>
		);
	}

	renderVirtualExchangeOptions() {
		if( this.state.exchangeAccountId !== 'virtual' ) return;

		return (
			<div className={styles.indentedInputWrapper}>
				<div className={styles.inputWrapper}>
					<InputGroup
						name="exchange"
						label="Exchange to get the prices"
						caption={this.state.errors.exchange}>
						<select name="exchange"
							value={ this.state.exchange }
							onChange={ e => this.setState({exchange: e.target.value})}>
							<option value="bitfinex">Bitfinex</option>
						</select>
					</InputGroup>
				</div>
				<InitialBalances
					symbols={this.getAssets() }
					balances={ this.state.initialBalances }
					onChange={ initialBalances => this.setState({initialBalances})} />
			</div>
		);
	}

	_onCreate = () => {
		let errors = this.getValidationErrors();
		this.setState({ errors });
		if (Object.keys(errors).length) {
			return Toaster.show('There are errors in the form');
		}

		const symbols = this.getSymbols();
		const {botId, exchangeAccountId, runInterval} = this.state;
		const payload = {
			accountId: this.props.accountId,
			botId, exchangeAccountId, runInterval,
			symbols,
			active: true
		};
		
		this.setState({ creating: true });
		this.props.onCreate(payload).then(res => {
			setTimeout(
				() => this.mounted && this.setState({ creating: false }),
				200
			);
		});
	}

	getValidationErrors() {
		const { baseAssets, quotedAsset, runInterval } = this.state;

		let errors: FormErrors = {};

		if (!baseAssets) {
			errors.baseAssets = { type: 'error', message: 'Please type the assets you want to trade separated by commas.' }
		}
		if (!quotedAsset) {
			errors.quotedAsset = { type: 'error', message: 'Please the asset you want to use to buy or sell the base assets.' }
		}
		if (!runInterval) {
			errors.runInterval = { type: 'error', message: 'Please select a run interval.' }
		}
		return errors;
	}

	getSymbols() {
		let symbols: string[] = [];
		this.state.baseAssets.split(/\s*,\s*/).forEach(symbol => {
			if (symbol.trim()) {
				symbols.push(symbol.trim() + '/' + this.state.quotedAsset);
			}
		});
		return symbols;
	}

	getAssets() {
		let symbols = [this.state.quotedAsset];
		this.state.baseAssets.split(/\s*,\s*/).forEach(symbol => {
			if (symbol.trim()) {
				symbols.push(symbol.trim());
			}
		});
		return symbols;
	}

	mounted = true
	componentWillUnmount() {
		this.mounted = false;
	}

	componentDidMount(){
		this.checkSelectedResources();
	}

	componentDidUpdate() {
		this.checkSelectedResources();
	}

	checkSelectedResources(){
		if( !this.dataLoaded ) return;
		if( !this.state.botId ){
			const {accountId} = this.props;
			let { data: bots } = botListLoader.getData(this, accountId);
			let { data: exchanges } = exchangeListLoader.getData(this, accountId);

			if( bots && exchanges ){
				console.log('Setting state');
				this.setState({
					botId: bots.length ? bots[0].id : '',
					exchangeAccountId: exchanges.length ? exchanges[0].id : ''
				});
			}
		}
	}
}
