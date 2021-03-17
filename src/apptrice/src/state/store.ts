const ors = require('@arqex/ors');

const store = ors({
	account: false,
	deployments: {},
	bots: {},
});

export default store;