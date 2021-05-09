import axios, { AxiosResponse } from 'axios';

export interface CandleOptions {
	symbol: string
	runInterval: string
	startDate: number
	endDate: number
}

export interface CreateDeploymentInput {
	accountId: string
	botId: string
	exchangeAccountId: string
	runInterval: string
	symbols: string[]
	active?: boolean
}

export interface CreateExchangeAccountInput {
	accountId: string
	name: string,
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
	accountId: string,
	active: boolean
}

export interface CreateBotInput {
	accountId: string,
	name: string,
	code: string
}

let API_URL: string;
const apiClient = {
	initialize( url: string ){
		API_URL = url;
	},

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

	createBot( input: CreateBotInput ): Promise<AxiosResponse> {
		return axios.post(`${API_URL}/bots`, input )
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

	createDeployment( input: CreateDeploymentInput ): Promise<AxiosResponse> {
		return axios.post(`${API_URL}/deployments`, input ).then( res => {
			console.log(res);
			return res;
		});
	},
 
	updateDeployment(deploymentId: string, payload: UpdateDeploymentInput): Promise<AxiosResponse> {
		return axios.patch(`${API_URL}/deployments/${deploymentId}`, payload)
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