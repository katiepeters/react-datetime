import AccountModel from '../_common/dynamo/AccountModel';
import ExchangeAccountModel from '../_common/dynamo/ExchangeAccountModel';
import BotDeploymentModel from '../_common/dynamo/BotDeploymentModel';
import BotModel from '../_common/dynamo/BotModel';
import lambdaUtil from '../_common/utils/lambda';

const fs = require('fs');
const path = require('path');

const serverless = require('serverless-http');
const express = require('express')
const app = express()

app.use(express.json());

app.get('/', function (req, res) {
	console.log('Hello!');
	res.send('Hello World!')
});

app.get('/accounts/:id', function(req, res){
	res.send('/account/:id not implemented yet');
});

app.get('/bots', function (req, res) {
	const { accountId, botId } = req.query;

	setTestData({accountId: 'testAccount'});

	if( !accountId ){
		return res
			.status(400)
			.json({error: 'invalid_payload', message: 'accountId not given'})
		;
	}

	if( botId ){
		return BotModel.getSingle(accountId, botId).then( bot => {
			if( !bot ){
				return res.status(404)
					.json({error: 'not_found'})
				;
			}
			
			return res.json(bot);
		});
	}

	BotModel.getAccountBots(accountId)
		.then( bots => {
			res.json(bots);
		})
	;
});

app.patch('/bots', function(req, res) {
	const { accountId, botId } = req.query;
	if (!accountId) return returnMissingAttr(res, 'accountId');
	if (!botId) return returnMissingAttr(res, 'botId');
	
	const {code} = req.body;
	if (!code) return returnMissingAttr(res, 'code');

	console.log('Patching bot!')
	BotModel.update(accountId, botId, {code})
		.then( () => {
			res.status(204).end();
		})
	;
});

app.get('/deployments', function (req, res) {
	res.send('/deployments not implemented yet');
});

app.get('/exchanges', function (req, res) {
	res.send('/exchanges not implemented yet');
});

app.post('/runnow', function(req, res) {
	const { accountId, deploymentId } = req.body;
	if (!accountId) return returnMissingAttr(res, 'accountId');
	if (!deploymentId) return returnMissingAttr(res, 'deploymentId');

	console.log('getting deployment');
	BotDeploymentModel.getSingle(accountId, deploymentId)
		.then( deployment => {
			if (!deployment ){
				return res.status(404)
					.json({error: 'not_found'})
				;
			}
			
			console.log('deployment found');

			lambdaUtil.invokeSupplierdo({accountId, deploymentId})
				.then(result => {
					console.log(result);
					res.status(200).end();
				})
			;
		})
})

export const apitron = serverless(app);


function isTest(event) {
	return event && event.isTest;
}

async function setTestData(event) {
	let { accountId } = event;
	let account = await AccountModel.getSingle(accountId);
	if (!account) {
		console.log('Creating test data');
		await AccountModel.create({
			id: accountId
		});

		await ExchangeAccountModel.create({
			accountId,
			id: 'testExchange',
			provider: 'bitfinex',
			type: 'real',
			key: 'Mma7B6ISTUNVcnUPOrDJgVgcNRh3VbmeIalaBDvUpml',
			secret: 'U2FsdGVkX18urwMNykZfeGeUbn4cGGgWgI7uGl3/qzeexDPcmUQX6cEAr9s5bcKe5wUhIKfwiysejvfD9h5lJw=='
		});

		await BotDeploymentModel.create({
			accountId,
			id: 'testDeployment',
			botId: 'testBot',
			orders: {},
			config: {
				exchangeAccountId: 'testExchange',
				exchangeType: 'bitfinex',
				interval: '1h',
				symbols: ['BTC/USD']
			},
			state: {}
		});

		await BotModel.create({
			name: 'Test bot',
			accountId,
			id: 'testBot',
			code: fs.readFileSync(path.join(__dirname, '../../../bots/testBot.ts'), 'utf8')
		});
	}
	else {
		console.log('Test data was already there');
	}
}


function returnMissingAttr( res, attrName ){
	res.status(400)
		.json({ error: 'invalid_payload', message: `${attrName} not given` })
	;
}