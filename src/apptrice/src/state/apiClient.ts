import axios, { AxiosResponse } from 'axios';

export interface CandleOptions {
	symbol: string
	runInterval: string
	startDate: number
	endDate: number
}

export interface CreateExchangeAccountInput {
	accountId: string
	provider: string,
	type: 'real' | 'virtual',
	key: string,
	secret: string
}

export interface UpdateBotInput {
	code?: string,
	name?: string,
}

export interface UpdateDeploymentInput {
	active: boolean
}

const API_URL = 'http://localhost:3030/dev';
const apiClient = {

	//////////
	// ACCOUNT
	//////////
	loadAccountData( accountId: string ): Promise<AxiosResponse>{
		return axios.get(`${API_URL}/accounts/${accountId}`)
			.then( res => {
				console.log(res);
				return res;
			})
		;
	},

	//////////
	// BOTS
	//////////
	loadBotList( accountId: string ): Promise<AxiosResponse>{
		return axios.get(`${API_URL}/bots?accountId=${accountId}`)
			.then(res => {
				console.log(res);
				return res;
			})
		;
	},

	loadSingleBot(accountId: string, botId: string): Promise<AxiosResponse> {
		return axios.get(`${API_URL}/bots/${botId}?accountId=${accountId}`)
			.then(res => {
				console.log(res);
				return res;
			})
		;
	},

	updateBot(accountId: string, botId: string, payload: UpdateBotInput): Promise<AxiosResponse> {
		return axios.patch(`${API_URL}/bots/${botId}?accountId=${accountId}`, payload)
			.then(res => {
				console.log(res);
				return res;
			})
		;
	},

	deleteBot(accountId: string, botId: string): Promise<AxiosResponse> {
		return axios.delete(`${API_URL}/bots/${botId}?accountId=${accountId}`)
			.then(res => {
				console.log(res);
				return res;
			})
			;
	},


	///////////////
	// DEPLOYMENTS
	///////////////
	loadDeploymentList( accountId: string ): Promise<AxiosResponse>{
		return axios.get(`${API_URL}/deployments?accountId=${accountId}`)
			.then(res => {
				console.log(res);
				return res;
			})
		;
	},

	loadSingleDeployment( accountId: string, deploymentId: string): Promise<AxiosResponse> {
		return axios.get(`${API_URL}/deployments/${deploymentId}?accountId=${accountId}`)
			.then( res => {
				console.log(res);
				return res;
			})
		;
	},

	updateDeployment(accountId: string, deploymentId: string, payload: UpdateDeploymentInput): Promise<AxiosResponse> {
		return axios.patch(`${API_URL}/bots/${deploymentId}?accountId=${accountId}`, payload)
			.then(res => {
				console.log(res);
				return res;
			})
			;
	},

	deleteDeployment(accountId: string, deploymentId: string): Promise<AxiosResponse> {
		return axios.delete(`${API_URL}/deployments/${deploymentId}?accountId=${accountId}`)
			.then(res => {
				console.log(res);
				return res;
			})
		;
	},

	////////////
	// CANDLES
	////////////
	loadCandles( {symbol, runInterval, startDate, endDate}: CandleOptions): Promise<AxiosResponse>{
		let query = `symbol=${symbol}&runInterval=${runInterval}&startDate=${startDate}&endDate=${endDate}`;
		return axios.get(`${API_URL}/candles?${query}`)
			.then(res => {
				console.log(res);
				return res;
			})
		;
	},

	/////////////
	// EXCHANGE ACCOUNTS
	/////////////
	loadExchangeAccountList( accountId: string ): Promise<AxiosResponse> {
		return axios.get(`${API_URL}/exchanges?accountId=${accountId}`)
			.then( res => {
				console.log(res);
				return res;
			})
		;
	},

	loadSingleExchangeAccount( accountId: string, exchangeAccountId: string ): Promise<AxiosResponse> {
		return axios.get(`${API_URL}/exchanges/${exchangeAccountId}?accountId=${accountId}`)
			.then(res => {
				console.log(res);
				return res;
			})
		;
	},

	createExchangeAccount(payload: CreateExchangeAccountInput): Promise<AxiosResponse> {
		return axios.post(`${API_URL}/exchanges`, payload)
			.then(res => {
				console.log(res);
				return res;
			})
		;
	},

	deleteExchangeAccount(accountId: string, exchangeAccountId: string ): Promise<AxiosResponse> {
		return axios.delete(`${API_URL}/exchanges/${exchangeAccountId}?accountId=${accountId}`)
			.then(res => {
				console.log(res);
				return res;
			})
		;
	},
}

export default apiClient;