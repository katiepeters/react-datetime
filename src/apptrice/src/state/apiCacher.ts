import { AxiosResponse } from 'axios';
import apiClient, { CandleOptions, CreateExchangeAccountInput, UpdateBotInput, UpdateDeploymentInput, CreateDeploymentInput } from './apiClient';
import store from './store';

export interface DbBot {
	id: string
	name: string
	accountId: string
	code: string
}

const apiCacher = {
	///////////
	// ACCOUNT
	///////////
	loadAccountData(accountId: string) {
		return apiClient.loadAccountData( accountId );
	},

	////////////
	// BOTS
	////////////
	loadBotList(accountId: string) {
		return apiClient.loadBotList(accountId)
			.then( res => {
				let botIds: string[] = [];
				res.data.forEach( (bot: DbBot) => {
					botIds.push(bot.id);
					store.bots[bot.id] = bot;
				})

				store.accounts[accountId].bots = botIds;
			})
		;
	},

	loadSingleBot( accountId: string, botId: string ) {
		return apiClient.loadSingleBot(accountId, botId)
			.then( (res: AxiosResponse) => {
				let bot = res.data;
				if( !bot.error ){
					store.bots[botId] = bot;
				}
				return res;
			})
		;
	},

	updateBot(accountId: string, botId: string, payload: UpdateBotInput): Promise<AxiosResponse> {
		return apiClient.updateBot(accountId, botId, payload)
			.then( (res: AxiosResponse) => {
				if( !res.data.error ){
					store.bots[botId] = {
						...(store.bots[botId] || {}),
						...res.data
					}
				}
				return res
			})
		;
	},

	deleteBot(accountId: string, botId: string ): Promise<AxiosResponse> {
		return apiClient.deleteBot( accountId, botId )
			.then( (res: AxiosResponse) => {
				if( !res.data.error ){
					let accountBots = store.accounts[accountId]?.bots;
					if( accountBots ){
						store.accounts[accountId].bots = accountBots.filter((id: string) => botId !== id);
					}
					delete store.bots[botId];
				}
				return res;
			})
		;
	},

	/////////////
	// DEPLOYMENTS
	///////////////
	loadDeploymentList(accountId: string): Promise<AxiosResponse> {
		return apiClient.loadDeploymentList(accountId)
			.then( res => {
				let deploymentIds = res.data.map( (d:any) => d.id );
				store.accounts[accountId].deployments = deploymentIds;
				let deployments = {...store.deployments};
				res.data.forEach( (deployment:any) => {
					deployments[deployment.id] = deployment;
				});

				store.deployments = deployments;
				return res;
			});
		;
	},

	loadSingleDeployment(accountId: string, deploymentId: string): Promise<AxiosResponse> {
		return apiClient.loadSingleDeployment(accountId, deploymentId)
			.then(res => {
				if( !res.data.error ){
					store.deployments[deploymentId] = res.data;
				}
				return res;
			});
		;
	},

	createDeployment(input: CreateDeploymentInput ): Promise<AxiosResponse> {
		return apiClient.createDeployment(input).then( res => {
			if( !res.data.error ){
				store.deployments[res.data.id] = {
					...input,
					id: res.data.id
				}
				let account = store.accounts[input.accountId];
				if( account ){
					account.deployments = [
						...(account.deployments || [] ),
						res.data.id
					];
				}
			}
			return res;
		})
	},

	updateDeployment(deploymentId: string, payload: UpdateDeploymentInput): Promise<AxiosResponse> {
		return apiClient.updateDeployment(deploymentId, payload)
			.then( res => {
				if( !res.data.error ){
					store.deployments[deploymentId] = {
						...(store.deployments[deploymentId] || {}),
						id: deploymentId,
						...payload
					};
				}
				return res;
			})
		;
	},

	deleteDeployment(accountId: string, deploymentId: string): Promise<AxiosResponse> {
		return apiClient.deleteDeployment(accountId, deploymentId)
			.then( res => {
				if( !res.data.error ){
					let deployments = store.accounts[accountId]?.deployments;
					if( deployments ){
							store.accounts[accountId].deployments = deployments.filter((id: string) => id !== deploymentId);
					}
					delete store.deployments[deploymentId];
				}
				return res;
			})
		;
	},


	////////////
	// CANDLES
	////////////
	getCandles( options: CandleOptions ) {
		return apiClient.loadCandles(options).then( res => {
			let {symbol, runInterval, startDate, endDate} = options;
			let key = `${symbol}:${runInterval}:${startDate}:${endDate}`;
			store.candles[key] = res.data;
			return res;
		})
	},


	////////////
	// EXCHANGE ACCOUNTS
	////////////
	loadExchangeAccountList(accountId: string): Promise<AxiosResponse> {
		return apiClient.loadExchangeAccountList(accountId)
			.then( res => {
				if( !res.data.error ){
					let ids: string[] = [];
					let exchanges: any = {};
					res.data.forEach( (exchange: any) => {
						ids.push( exchange.id );
						exchanges[ exchange.id ] = exchange;
					});

					let account = store.accounts[accountId];
					if( account ){
						account.exchangeAccounts = ids;
					}
					store.exchangeAccounts = {
						...store.exchangeAccounts,
						...exchanges
					};
				}
				return res;
			})
		;
	},

	loadSingleExchangeAccount(accountId: string, exchangeAccountId: string): Promise<AxiosResponse> {
		return apiClient.loadSingleExchangeAccount(accountId, exchangeAccountId)
			.then(res => {
				if( !res.data.error ){
					store.exchangeAccounts[ exchangeAccountId ] = res.data; 
				}
				return res;
			})
		;
	},

	createExchangeAccount(payload: CreateExchangeAccountInput): Promise<AxiosResponse> {
		return apiClient.createExchangeAccount(payload)
			.then(res => {
				if( !res.data.error ){
					let account = store.accounts[payload.accountId];
					if( account ){
						store.accounts[payload.accountId].exchangeAccounts = [
							...(account.exchangeAccounts || []),
							res.data.id
						];					
					}
					store.exchangeAccounts[ res.data.id ] = {
						id: res.data.id,
						name: payload.name,
						provider: payload.provider,
						type: payload.type
					};
				}
				return res;
			})
		;
	},
	deleteExchangeAccount(accountId: string, exchangeAccountId: string): Promise<AxiosResponse> {
		return apiClient.deleteExchangeAccount(accountId, exchangeAccountId)
			.then(res => {
				if( !res.data.error ){
					let exchanges = store.accounts[accountId]?.exchangeAccounts;
					if( exchanges ){
						store.accounts[accountId].exchangeAccounts = exchanges.filter( (id: string) => id !== exchangeAccountId );
					} 
					delete store.exchangeAccounts[exchangeAccountId];
				}
				return res;
			});
		;
	}
}

export default apiCacher;