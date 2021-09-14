import { DBModel } from './db';
import { DynamoExchange, DynamoExchangeInput, ModelExchange } from '../../model.types';
import s3Helper from '../utils/s3';
import { Portfolio } from '../../lambda.types';
import { ExchangeOrder } from '../exchanges/ExchangeAdapter';
import arrayize from '../utils/arrayize';
import { parseId } from '../utils/resourceId';

const Db = new DBModel<DynamoExchange>();

 interface DeleteExchangeAccountInput {
	id: string
	deleteExtra?: boolean
}

export default {
	async getSingle(compoundId: string): Promise<ModelExchange | void> {
		let {accountId, resourceId: exchangeId} = parseId(compoundId);
		const exchange = await Db.getSingle(accountId, `EXCHANGE#${exchangeId}`);
		if( exchange ) {
			return dynamoToModel(exchange);
		}
	},

	async getVirtualPorftolio( compoundId: string ): Promise<Portfolio> {
		let {accountId, resourceId: exchangeId} = parseId(compoundId);
		const portfolio = await getLastPortfolio(accountId, exchangeId);
		if( portfolio ){
			return JSON.parse(portfolio);
		}
		return {};
	},

	async getVirtualOrders( compoundId: string ) {
		let {accountId, resourceId: exchangeId} = parseId(compoundId);
		const orders = await getOrders(accountId, exchangeId);
		if (orders) {
			return JSON.parse(orders);
		}
		return {};
	},

	async updatePortfolio( compoundId: string, portfolio: Portfolio ){
		let {accountId, resourceId: exchangeId} = parseId(compoundId);
		await saveLastPortfolio(accountId, exchangeId, JSON.stringify(portfolio) );
		return {error: false};
	},

	async updateOrders(compoundId: string, orders: {[id: string]: ExchangeOrder} ){
		let {accountId, resourceId: exchangeId} = parseId(compoundId);
		return await saveOrders( accountId, exchangeId, JSON.stringify(orders) );
	},
	
	async getAccountExchanges(accountId:string): Promise<ModelExchange[]> {
		let exchanges = await Db.getMultiple(accountId, 'EXCHANGE#');
		return exchanges.map( dynamoToModel );
	},

	async create(account: DynamoExchangeInput): Promise<void> {
		const {accountId, id: exchangeId} = account;

		// @ts-ignore
		let exchange: DynamoExchange = {
			...arrayize(account).filterKeys(['accountId', 'name', 'provider', 'type', 'key', 'secret']),
			resourceId: `EXCHANGE#${exchangeId}`
		};
		
		console.log('Creating exchange');
		let promises: Promise<any>[] = [
			Db.put(exchange)
		];

		if (account.type === 'virtual') {
			console.log('Createing last portfolio and orders');
			promises = [...promises, ...[
				saveLastPortfolio( accountId, exchangeId, JSON.stringify(account.initialBalances)),
				saveOrders( accountId, exchangeId, '{}')
			]];
		}

		// @ts-ignore
		await Promise.all( promises );
	},
	async update(compoundId: string, update: any ){
		let {accountId, resourceId: exchangeId} = parseId(compoundId);
		return await Db.update(accountId, `EXCHANGE#${exchangeId}`, update);
	},
	async delete({id, deleteExtra}: DeleteExchangeAccountInput){
		let {accountId, resourceId: exchangeId} = parseId(id);
		let promises: Promise<any>[] = [
			Db.del(accountId, `EXCHANGE#${exchangeId}`)
		];

		if( deleteExtra ){
			promises = [...promises, ...[
				delLastPortfolio(accountId, exchangeId),
				delOrders(accountId, exchangeId)
			]];
		}

		return await Db.del(accountId, `EXCHANGE#${exchangeId}`);
	}
}

function getLastPortfolioFileName(accountId: string, exchangeId: string) {
	return `${accountId}/ex-${exchangeId}/lastPortfolio`;
}
function getOrdersFileName(accountId: string, exchangeId: string) {
	return `${accountId}/ex-${exchangeId}/orders`;
}

function getLastPortfolio(accountId: string, exchangeId: string) {
	return s3Helper.botState.getContent(getLastPortfolioFileName(accountId, exchangeId));
}
function getOrders(accountId: string, exchangeId: string) {
	return s3Helper.botState.getContent(getOrdersFileName(accountId, exchangeId));
}

function saveLastPortfolio(accountId: string, exchangeId: string, logs: string) {
	return s3Helper.botState.setContent(getLastPortfolioFileName(accountId, exchangeId), logs);
}
function saveOrders(accountId: string, exchangeId: string, orders: string) {
	return s3Helper.botState.setContent(getOrdersFileName(accountId, exchangeId), orders);
}

function delLastPortfolio(accountId: string, exchangeId: string) {
	return s3Helper.botState.delObject(getLastPortfolioFileName(accountId, exchangeId));
}
function delOrders(accountId: string, exchangeId: string) {
	return s3Helper.botState.delObject(getOrdersFileName(accountId, exchangeId));
}

function dynamoToModel( dynamoExchange: DynamoExchange ): ModelExchange {
	const {resourceId, accountId, ...baseAccount} = dynamoExchange;
	return {
		id: resourceId.replace('EXCHANGE#', '') + accountId,
		...baseAccount
	}
}

function modelToDynamo( modelExchange: ModelExchange ): DynamoExchange {
	const {id, ...baseBot} = modelExchange;
	const {resourceId, accountId} = parseId(id);
	return {
		accountId,
		resourceId: `EXCHANGE#${resourceId}`,
		...baseBot
	}
}