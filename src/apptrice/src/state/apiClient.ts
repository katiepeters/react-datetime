import axios from 'axios';


const API_URL = 'http://localhost:3000/dev';
const apiClient = {
	getAccountData( accountId: string ){
		return axios.get(`${API_URL}/accounts/${accountId}`)
			.then( res => {
				console.log( res );
			})
		;
	},

	getBots( accountId: string ){
		return axios.get(`${API_URL}/bots?accountId=${accountId}`)
			.then(res => {
				console.log(res);
			})
		;
	},

	getDeployments( accountId: string ){
		return axios.get(`${API_URL}/deployments?accountId=${accountId}`)
			.then(res => {
				console.log(res);
			})
		;
	}
}

export default apiClient;