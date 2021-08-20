const store = {
	authenticatedId: 'testAccount',
	accounts: {
		testAccount: {id: 'testAccount'} 
	},
	deployments: {},
	bots: {},
	candles: {},
	exchangeAccounts: {},
	botVersions: {},
	transientData: {}
};

// @ts-ignore
window.store = store;
export default store; 