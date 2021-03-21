import axios, { AxiosResponse } from 'axios';


const API_URL = 'http://localhost:3030/dev';
const apiClient = {
	loadAccountData( accountId: string ): Promise<AxiosResponse>{
		return axios.get(`${API_URL}/accounts/${accountId}`)
			.then( res => {
				console.log(res);
				return res;
			})
		;
	},

	loadBotList( accountId: string ): Promise<AxiosResponse>{
		return axios.get(`${API_URL}/bots?accountId=${accountId}`)
			.then(res => {
				console.log(res);
				return res;
			})
		;
	},

	loadSingleBot(accountId: string, botId: string): Promise<AxiosResponse> {
		return axios.get(`${API_URL}/bots?accountId=${accountId}&botId=${botId}`)
			.then(res => {
				console.log(res);
				return res;
			})
		;
	},

	updateBot(accountId: string, botId: string, code: string): Promise<AxiosResponse> {
		return axios.patch(`${API_URL}/bots?accountId=${accountId}&botId=${botId}`, {code})
			.then(res => {
				console.log(res);
				return res;
			})
		;
	},

	loadDeploymentList( accountId: string ): Promise<AxiosResponse>{
		return axios.get(`${API_URL}/deployments?accountId=${accountId}`)
			.then(res => {
				console.log(res);
				return res;
			})
		;
	}
}

export default apiClient;