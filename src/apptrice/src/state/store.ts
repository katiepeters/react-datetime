const ors = require('@arqex/ors');

const store = ors({
	authenticatedId: 'testAccount',
	accounts: {
		testAccount: {id: 'testAccount'} 
	},
	deployments: {},
	bots: {},
});

export default store; 