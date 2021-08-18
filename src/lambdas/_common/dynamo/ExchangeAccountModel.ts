import { DBModel } from './db';
import { DbExchangeAccount, DbExchangeAccountInput } from '../../model.types';
import s3Helper from '../utils/s3';
import { Portfolio } from '../../lambda.types';
import { ExchangeOrder } from '../exchanges/ExchangeAdapter';
import arrayize from '../utils/arrayize';

const Db = new DBModel<DbExchangeAccount>();

 interface DeleteExchangeAccountInput {
	accountId: string
	exchangeAccountId: string
	deleteExtra?: boolean
}

export default {
	async getSingle(accountId: string, exchangeId: string): Promise<DbExchangeAccount | void> {
		return await Db.getSingle(accountId, `EXCHANGE#${exchangeId}`);
	},

	async getVirtualPorftolio( accountId: string, exchangeId: string ): Promise<Portfolio> {
		const portfolio = await getLastPortfolio(accountId, exchangeId);
		if( portfolio ){
			return JSON.parse(portfolio);
		}
		return {};
	},

	async getVirtualOrders( accountId: string, exchangeId: string ) {
		const orders = await getOrders(accountId, exchangeId);
		if (orders) {
			return JSON.parse(orders);
		}
		return {};
	},

	async updatePortfolio( accountId: string, exchangeId: string, portfolio: Portfolio ){
		await saveLastPortfolio(accountId, exchangeId, JSON.stringify(portfolio) );
		return {error: false};
	},

	async updateOrders(accountId: string, exchangeId: string, orders: {[id: string]: ExchangeOrder} ){
		return await saveOrders( accountId, exchangeId, JSON.stringify(orders) );
	},
	
	async getAccountExchanges(accountId:string): Promise<DbExchangeAccount[]> {
		return await Db.getMultiple(accountId, 'EXCHANGE#');
	},

	async create(account: DbExchangeAccountInput): Promise<void> {
		const {accountId, id: exchangeId} = account;

		// @ts-ignore
		let exchange: DbExchangeAccount = {
			...arrayize(account).filterKeys(['accountId', 'id', 'name', 'provider', 'type', 'key', 'secret']),
			resourceId: `EXCHANGE#${exchangeId}`
		};
		
		console.log('Createing exchange');
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
	async update(accountId: string, exchangeId: string, update: any ){
		return await Db.update(accountId, `EXCHANGE#${exchangeId}`, update);
	},
	async delete({accountId, exchangeAccountId, deleteExtra}: DeleteExchangeAccountInput){
		let promises: Promise<any>[] = [
			Db.del(accountId, `EXCHANGE#${exchangeAccountId}`)
		];

		if( deleteExtra ){
			promises = [...promises, ...[
				delLastPortfolio(accountId, exchangeAccountId),
				delOrders(accountId, exchangeAccountId)
			]];
		}

		return await Db.del(accountId, `EXCHANGE#${exchangeAccountId}`);
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