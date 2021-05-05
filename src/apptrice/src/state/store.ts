const ors = require('@arqex/ors');

const store = ors({
	authenticatedId: 'testAccount',
	accounts: {
		testAccount: {id: 'testAccount'} 
	},
	deployments: {},
	bots: {},
	candles: {},
	currentBackTesting: null,
	exchangeAccounts: {},
});

// @ts-ignore
window.store = store;

export default store; 