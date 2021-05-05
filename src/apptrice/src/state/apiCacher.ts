import { AxiosResponse } from 'axios';
import apiClient, { CandleOptions } from './apiClient';
import store from './store';

export interface DbBot {
	id: string
	name: string
	accountId: string
	code: string
}

const apiCacher = {
	loadAccountData(accountId: string) {
		return apiClient.loadAccountData( accountId );
	},

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

	updateBot(accountId: string, botId: string, code: string): Promise<AxiosResponse> {
		return apiClient.updateBot(accountId, botId, code)
			.then( (res: AxiosResponse) => {
				if( !res.data.error ){
					store.bots[botId].code = code;
				}
				return res
			})
		;
	},

	loadDeploymentList(accountId: string) {
		return apiClient.loadDeploymentList(accountId)
			.then( res => {
				let deploymentIds = res.data.map( (d:any) => d.id );
				store.accounts[accountId].deployments = deploymentIds;
				let deployments = {...store.deployments};
				res.data.forEach( (deployment:any) => {
					deployments[deployment.id] = deployment;
				});

				store.deployments = deployments;
			})
		;
	},

	getCandles( options: CandleOptions ) {
		return apiClient.loadCandles(options).then( res => {
			let {symbol, runInterval, startDate, endDate} = options;
			let key = `${symbol}:${runInterval}:${startDate}:${endDate}`;
			store.candles[key] = res.data;
			return res;
		})
	}
}

export default apiCacher;