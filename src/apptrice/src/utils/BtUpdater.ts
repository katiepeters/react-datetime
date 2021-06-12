import quickStore from "../state/quickStore"
import { ActiveBtUpdate, BtActive, BtDeployment, BtExchange, BtStored } from "./Bt.types"

export const BtUpdater = {
	setBt( bt: BtActive ){
		quickStore.setActiveBt(bt);
	},

	update( data: ActiveBtUpdate ){
		let activeBt = {
			...( quickStore.getActiveBt() || defaultActiveBt )
		};

		if( data.totalIterations ){
			activeBt.totalIterations = data.totalIterations;
		}
		if (data.currentIteration) {
			activeBt.currentIteration = data.currentIteration;
		}
		if (data.candles) {
			activeBt.candles = data.candles;
		}
		if (data.status) {
			activeBt.status = data.status;
		}

		if( data.accountId || data.botId || data.provider || data.startDate || data.endDate || data.deployment || data.exchange ){
			let dataUpdate: BtStored = { ...activeBt.data };

			if (data.accountId) {
				dataUpdate.accountId = data.accountId;
			}
			if (data.botId) {
				dataUpdate.botId = data.botId;
			}
			if (data.provider) {
				dataUpdate.provider = data.provider;
			}
			if (data.startDate) {
				dataUpdate.startDate = data.startDate;
			}
			if (data.endDate) {
				dataUpdate.endDate = data.endDate;
			}
			if (data.deployment) {
				dataUpdate.deployment = data.deployment;
			}
			if (data.exchange) {
				dataUpdate.exchange = data.exchange;
			}

			activeBt.data = dataUpdate;
		}

		if( data.logs || data.orders || data.runInterval || data.state || data.symbols ){
			let deploymentUpdate: BtDeployment = { ...activeBt.data.deployment };
			if( data.logs ){
				deploymentUpdate.logs = data.logs;
			}
			if (data.orders) {
				deploymentUpdate.orders = data.orders;
			}
			if (data.runInterval) {
				deploymentUpdate.runInterval = data.runInterval;
			}
			if (data.state) {
				deploymentUpdate.state = data.state;
			}
			if (data.symbols) {
				deploymentUpdate.symbols = data.symbols;
			}

			activeBt.data.deployment = deploymentUpdate;
		}


		if (data.logs || data.orders || data.runInterval || data.state || data.symbols) {
			let deploymentUpdate: BtDeployment = { ...activeBt.data.deployment };
			if (data.logs) {
				deploymentUpdate.logs = data.logs;
			}
			if (data.orders) {
				deploymentUpdate.orders = data.orders;
			}
			if (data.runInterval) {
				deploymentUpdate.runInterval = data.runInterval;
			}
			if (data.state) {
				deploymentUpdate.state = data.state;
			}
			if (data.symbols) {
				deploymentUpdate.symbols = data.symbols;
			}

			activeBt.data.deployment = deploymentUpdate;
		}

		if( data.portfolioHistory || data.fees || data.slippage ) {
			let exchangeUpdate: BtExchange = { ...activeBt.data.exchange };
			if( data.portfolioHistory ){
				exchangeUpdate.portfolioHistory = data.portfolioHistory;
			}
			if (data.fees) {
				exchangeUpdate.fees = data.fees;
			}
			if (data.slippage) {
				exchangeUpdate.slippage = data.slippage;
			}

			activeBt.data.exchange = exchangeUpdate;
		}

		quickStore.setActiveBt(activeBt);
	},

	clear(){
		quickStore.setActiveBt(undefined);
	}
}


const defaultActiveBt: BtActive = {
	totalIterations: 0,
	currentIteration: 0,
	candles: {},
	status: 'init',
	data: {
		accountId: 'init',
		botId: 'init',
		provider: 'bitfinex',
		startDate: 0,
		endDate: 0,
		deployment: {
			logs: [],
			orders: {
				foreignIdIndex: {},
				items: {},
				openOrderIds: []
			},
			runInterval: '1h',
			state: {},
			symbols: []
		},
		exchange: {
			portfolioHistory: [],
			fees: 0,
			slippage: 0
		}
	}
}