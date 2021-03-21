import { DBModel, TableItem } from './dynamo/db';
import AccountModel from './dynamo/AccountModel';
import ExchangeAccountModel from './dynamo/ExchangeAccountModel';
import BotDeploymentModel from './dynamo/BotDeploymentModel';
import BotModel from './dynamo/BotModel';
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
			secret: 'ckm9hrkka000dyq349ngb2jro'
		});

		await BotDeploymentModel.create({
			accountId,
			id: 'testDeployment',
			orders: {},
			config: {
				exchangeAccountId: 'EXCHANGE#testExchange',
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