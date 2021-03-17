import apiClient from './apiClient';

const apiCacher = {
	getAccountData(accountId: string) {
		return apiClient.getAccountData( accountId );
	},

	getBots(accountId: string) {
		return apiClient.getBots(accountId);
	},

	getDeployments(accountId: string) {
		return apiClient.getDeployments(accountId);
	}
}

export default apiCacher;