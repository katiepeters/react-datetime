import { reducer } from "../../state/stateManager";
import { ActiveBtUpdate, BtActive, BtDeployment, BtExchange, BtStored } from "../../utils/backtest/Bt.types";

export const BtUpdater = {
	setBt: reducer<BtActive>( (store, activeBt) => {
		return {
			...store,
			transientData: {
				...store.transientData,
				activeBt
			}
		}
	}),

	update: reducer<ActiveBtUpdate>( (store, data) => {
		let activeBt = {
			...( store.transientData.activeBt || defaultActiveBt )
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

		if( data.accountId || data.botId || data.provider || data.deployment ){
			let dataUpdate: BtStored = { ...activeBt.data };

			if (data.accountId) {
				dataUpdate.accountId = data.accountId;
			}
			if (data.botId) {
				dataUpdate.botId = data.botId;
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


		if (data.logs || data.orders || data.runInterval || data.state || data.symbols || data.portfolioHistory) {
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
			if( data.portfolioHistory ){
				deploymentUpdate.portfolioHistory = data.portfolioHistory;
			}

			activeBt.data.deployment = deploymentUpdate;
		}

		if( data.portfolioHistory || data.fees || data.slippage || data.provider ) {
			let exchangeUpdate: BtExchange = { ...activeBt.data.exchange };
			if (data.fees) {
				exchangeUpdate.fees = data.fees;
			}
			if (data.slippage) {
				exchangeUpdate.slippage = data.slippage;
			}
			if(data.provider ){
				exchangeUpdate.provider = data.provider;
			}

			activeBt.data.exchange = exchangeUpdate;
		}

		return {
			...store,
			transientData: {
				...store.transientData,
				activeBt
			}
		}
	}),

	clear: reducer<void>( (store) => {
		let transientData = {...store.transientData};
		delete transientData.activeBt;
		return {
			...store,
			transientData
		}
	})
}


const defaultActiveBt: BtActive = {
	totalIterations: 0,
	currentIteration: 0,
	candles: {},
	status: 'init',
	data: {
		id: 'none',
		accountId: 'init',
		botId: 'init',
		versionNumber: '0.0',
		deployment: {
			logs: [],
			orders: {
				foreignIdIndex: {},
				items: {},
				openOrderIds: []
			},
			runInterval: '1h',
			state: {},
			symbols: [],
			portfolioHistory: [],
			activeIntervals: []
		},
		exchange: {
			provider: 'bitfinex',
			fees: 0,
			slippage: 0
		}
	}
}