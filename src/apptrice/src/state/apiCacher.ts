import { AxiosResponse } from 'axios';
import apiClient from './apiClient';
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
		return apiClient.loadDeploymentList(accountId);
	}
}

export default apiCacher;