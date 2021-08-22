import { AxiosResponse } from 'axios';
import { getActivatedDeployment, getDeactivatedDeployment } from '../../../lambdas/_common/utils/deploymentUtils';
import apiClient, { CandleOptions, CreateExchangeAccountInput, UpdateBotInput, UpdateDeploymentInput, CreateDeploymentInput, CreateBotInput, CreateBotVersionInput, UpdateBotVersionInput } from './apiClient';
import manager from '../state/dataManager';
import { DbBot, VersionHistory } from '../../../lambdas/model.types';
import { getCandlesKey, getVersionKey } from './storeKeys';

const {reducer} = manager;

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
				reducer<any>( (store, res) => {
					let botIds: string[] = [];
					let bots = {
						...store.bots
					}
					res.data.forEach( (bot: DbBot) => {
						botIds.push(bot.id);
						bots[bot.id] = bot;
					});

					return {
						...store,
						bots,
						accounts: {
							...store.accounts,
							[accountId]: {
								...store.accounts[accountId],
								bots: botIds
							}
						}
					};
				})(res);

				return res;
			})
		;
	},

	loadSingleBot( accountId: string, botId: string ) {
		return apiClient.loadSingleBot(accountId, botId)
			.then( (res: AxiosResponse) => {
				reducer<AxiosResponse>( (store, res) => {
					return {
						...store,
						bots: {
							...store.bots,
							[botId]: res.data
						}
					};
				})(res);
				
				return res;
			})
		;
	},

	createBot( input: CreateBotInput ): Promise<AxiosResponse>{
		return apiClient.createBot( input )
			.then( (res: AxiosResponse) => {
				if (!res.data.error) {
					reducer<AxiosResponse>( (store, res) => {
						const bot = {
							id: res.data.id,
							...input,
							versions: [
								{ lastMinor: 0, available:[{number: 0, createdAt: Date.now()}] }
							]
						};
						let account = store.accounts[bot.accountId];
						if( account ){
							account.bots = [
								...(account.bots || []),
								bot.id
							];
						}

						return {
							...store,
							bots: {
								...store.bots,
								[res.data.id]: bot
							},
							accounts: {
								...store.accounts,
								[bot.accountId]: account
							},
							botVersions: {
								...store.botVersions,
								[getVersionKey({botId: bot.id, versionNumber: '0.0'})]: {
									accountId: bot.accountId,
									botId: bot.id,
									number: '0.0',
									code: '',
									createdAt: Date.now(),
									updatedAt: Date.now(),
									isLocked: false,
									label: ''
								}
							}
						};
					} )(res);
				}
				return res;
			})
		;
	},

	updateBot(accountId: string, botId: string, payload: UpdateBotInput): Promise<AxiosResponse> {
		return apiClient.updateBot(accountId, botId, payload)
			.then( (res: AxiosResponse) => {
				if( !res.data.error ){
					reducer<AxiosResponse>( (store, res) => {
						return {
							...store,
							bots: {
								...store.bots,
								[botId]: {
									...(store.bots[botId] || {}),
									...payload,
									...res.data
								}
							}
						}
					})(res);
				}
				return res
			})
		;
	},

	deleteBot(accountId: string, botId: string ): Promise<AxiosResponse> {
		return apiClient.deleteBot( accountId, botId )
			.then( (res: AxiosResponse) => {
				if( !res.data.error ){
					reducer<AxiosResponse>( (store, res) => {
						let bots = {...store.bots};
						delete bots[botId];

						return {
							...store,
							accounts: {
								...store.accounts,
								[accountId]: {
									...store.accounts[accountId],
									bots: store.accounts[accountId]?.bots?.filter( (bid:string) => bid !== botId )
								}
							},
							bots
						};
					})(res);
				}
				return res;
			})
		;
	},


	///////////////
	// BOT VERSIONS
	///////////////

	loadSingleBotVersion(accountId: string, botId: string, versionNumber: string) {
		return apiClient.loadSingleBotVersion(accountId, botId, versionNumber)
			.then( res => {
				reducer<any>( (store, res) => {
					return {
						...store,
						botVersions: {
							...store.botVersions,
							[getVersionKey({botId, versionNumber})]: {...res.data}
						}
					}
				})(res);
				return res;
			})
		;
	},

	createBotVersion( input: CreateBotVersionInput ): Promise<AxiosResponse> {
		return apiClient.createBotVersion(input)
			.then(res => {
				reducer<any>( (store, res) => {
					let {number, code} = res.data;
					let numberParts = number.split('.');
					let botVersions = store.bots[ input.botId ].versions;
					if( botVersions ){
						let major = botVersions && botVersions[numberParts[0]];
						let minor = { createdAt: Date.now(), number: numberParts[1] };
						let version: VersionHistory = {
							lastMinor: numberParts[1],
							available: major ? 
								[ ...major.available, minor ] :
								[ minor ]
						};
						botVersions = [ ...botVersions];
						botVersions[numberParts[0]] = version;
					}

					return {
						...store,
						bots: {
							...store.bots,
							[input.botId]: {
								...store.bots[ input.botId ],
								versions: botVersions
							}
						},
						botVersions: {
							...store.botVersions,
							[getVersionKey({botId: input.botId, versionNumber: number})]: {
								accountId: input.accountId,
								botId: input.botId,
								number,
								code,
								createdAt: Date.now(),
								updatedAt: Date.now(),
								isLocked: false,
								label: ''
							}
						}
					};
				} )(res);
				
				return res;
			})
		;
	},

	updateBotVersion( accountId: string, botId: string, number: string, update: UpdateBotVersionInput ) {
		return apiClient.updateBotVersion(accountId, botId, number, update)
			.then( res => {
				reducer<any>( (store, res) => {
					return {
						...store,
						botVersions: {
							...store.botVersions,
							[`${botId}:${number}`]: {
								...store.botVersions[`${botId}:${number}`],
								updatedAt: Date.now(),
								...update
							}
						}
					}
				} )(res);
				
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
				reducer<any>( (store, res) => {
					let deployments = {...store.deployments};
					let deploymentIds: string[] = [];
					res.data.forEach( (deployment:any) => {
						deployments[deployment.id] = deployment;
						deploymentIds.push(deployment.id);
					});

					return {
						...store,
						deployments,
						accounts:{
							...store.accounts,
							[accountId]: {
								...store.accounts[accountId],
								deployments: deploymentIds
							}
						}
					};
				} )(res);
				
				return res;
			});
		;
	},

	loadSingleDeployment(accountId: string, deploymentId: string): Promise<AxiosResponse> {
		return apiClient.loadSingleDeployment(accountId, deploymentId)
			.then(res => {
				if( !res.data.error ){
					reducer<any>( (store, res) => {
						return {
							...store,
							deployments: {
								...store.deployments,
								[deploymentId]: res.data
							}
						};
					})(res);
				}
				return res;
			});
		;
	},

	createDeployment(input: CreateDeploymentInput ): Promise<AxiosResponse> {
		return apiClient.createDeployment(input).then( res => {
			if( !res.data.error ){
				reducer<any>( (store, res) => {
					let account = store.accounts[input.accountId];
					return {
						...store,
						deployments: {
							...store.deployments,
							[res.data.id]: {
								...input,
								createdAt: Date.now(),
								activeIntervals: [[Date.now()]],
								id: res.data.id
							}
						},
						accounts: {
							...store.accounts,
							[input.accountId]: {
								...account,
								deployments: [
									...(account.deployments || [] ),
									res.data.id
								]
							}
						}
					}
				})(res);
			}
			return res;
		})
	},

	updateDeployment(deploymentId: string, payload: UpdateDeploymentInput): Promise<AxiosResponse> {
		return apiClient.updateDeployment(deploymentId, payload)
			.then( res => {
				if( !res.data.error ){
					reducer<any>( (store, res) => {

						const current = store.deployments[deploymentId] || {id: deploymentId, activeIntervals:[]};
						return {
							...store,
							deployments: {
								...store.deployments,
								[deploymentId]: payload.active ?
									getActivatedDeployment( current ) : 
									getDeactivatedDeployment( current )
							}
						}
					} )(res)
				}
				return res;
			})
		;
	},

	deleteDeployment(accountId: string, deploymentId: string): Promise<AxiosResponse> {
		return apiClient.deleteDeployment(accountId, deploymentId)
			.then( res => {
				if( !res.data.error ){
					reducer<any>( (store, res) => {
						let deployments = {...store.deployments};
						delete deployments[deploymentId];
						return {
							...store,
							deployments,
							accounts: {
								...store.accounts,
								[accountId]: {
									...store.accounts[accountId],
									deployments: (store.accounts[accountId].deployments||[]).filter((id: string) => id !== deploymentId)
								} 
							}
						}
					})(res);
				}
				return res;
			})
		;
	},


	////////////
	// CANDLES
	////////////
	loadCandles( options: CandleOptions ) {
		return apiClient.loadCandles(options).then( res => {
			reducer<any>( (store, res) => {
				let {symbol, runInterval, startDate, endDate} = options;
				let key = getCandlesKey({exchange: 'bitfinex',symbol,runInterval,startDate,endDate});
				return {
					...store,
					transientData: {
						...store.transientData,
						candles: {
							...store.transientData.candles,
							[key]: res.data
						}
					}
				};
			} )(res)
			
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
					reducer<any>( (store, res) => {
						let account = store.accounts[accountId];
						let ids: string[] = [];
						let exchanges: any = {};
						res.data.forEach( (exchange: any) => {
							ids.push( exchange.id );
							exchanges[ exchange.id ] = exchange;
						});

						return {
							...store,
							exchangeAccounts: {
								...store.exchangeAccounts,
								...exchanges
							},
							accounts: {
								...store.accounts,
								[accountId]: {
									...(account || {}),
									exchangeAccounts: ids
								}
							}
						}
					} )(res)
				}
				return res;
			})
		;
	},

	loadSingleExchangeAccount(accountId: string, exchangeAccountId: string): Promise<AxiosResponse> {
		return apiClient.loadSingleExchangeAccount(accountId, exchangeAccountId)
			.then(res => {
				if( !res.data.error ){
					reducer<any>( (store, res) => {
						return {
							...store,
							exchangeAccounts: {
								...store.exchangeAccounts,
								[exchangeAccountId]: res.data
							}
						}
					})(res)
				}
				return res;
			})
		;
	},

	createExchangeAccount(payload: CreateExchangeAccountInput): Promise<AxiosResponse> {
		return apiClient.createExchangeAccount(payload)
			.then(res => {
				if( !res.data.error ){
					reducer<any>( (store, res) => {
						let account = store.accounts[payload.accountId];
						return {
							...store,
							exchangeAccounts: {
								...store.exchangeAccounts,
								[res.data.id]: {
									id: res.data.id,
									name: payload.name,
									provider: payload.provider,
									type: payload.type
								}
							},
							accounts: {
								...store.accounts,
								[payload.accountId]: {
									...account,
									exchangeAccounts: [
										...( account.exchangeAccounts || [] ),
										res.data.id
									]
								}
							}
						};
					})(res);
				}
				return res;
			})
		;
	},
	deleteExchangeAccount(accountId: string, exchangeAccountId: string): Promise<AxiosResponse> {
		return apiClient.deleteExchangeAccount(accountId, exchangeAccountId)
			.then(res => {
				if( !res.data.error ){
					reducer<any>( (store, res) => {
						let exchangeAccounts = {...store.exchangeAccounts};
						let account = store.accounts[accountId] || {};
						delete exchangeAccounts[exchangeAccountId];
						return {
							...store,
							exchangeAccounts,
							accounts: {
								...store.accounts,
								[accountId]: {
									...account,
									exchangeAccounts: account.exchangeAccounts?.filter( (id: string) => id !== exchangeAccountId )
								}
							}
						}
					} )(res);
				}
				return res;
			});
		;
	}
}

export default apiCacher;