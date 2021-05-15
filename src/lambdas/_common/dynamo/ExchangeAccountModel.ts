import { DBModel } from './db';
import { DbExchangeAccount, DbExchangeAccountInput, ExchangeAccountWithHistory, ExchangeAccountWithOrders } from '../../model.types';
import s3Helper from '../utils/s3';

const Db = new DBModel<DbExchangeAccount>();

interface DeleteExchangeAccountInput {
	accountId: string
	exchangeAccountId: string
}

export default {
	async getSingle(accountId: string, exchangeId: string): Promise<DbExchangeAccount | void> {
		return await Db.getSingle(accountId, `EXCHANGE#${exchangeId}`);
	},

	async getSingleWithHistory( accountId: string, exchangeId: string ): Promise<ExchangeAccountWithHistory | void> {
		let dbExchange = await this.getSingle( accountId, exchangeId );
		if( !dbExchange ) return;

		let history = await getPortfolioHistory(accountId, exchangeId);

		return {
			...dbExchange,
			portfolioHistory: JSON.parse(history)
		}
	},

	async getSingleWithOrders( accountId: string, exchangeId: string ): Promise<ExchangeAccountWithOrders | void> {
		let dbExchange = await this.getSingle(accountId, exchangeId);
		if (!dbExchange) return;

		let [portfolio, orders] = await Promise.all([
			getLastPortfolio(accountId, exchangeId),
			getOrders(accountId, exchangeId)
		]);

		return {
			...dbExchange,
			lastPortfolio: JSON.parse(portfolio),
			orders: JSON.parse(orders)
		};
	},
	
	async getAccountExchanges(accountId:string): Promise<DbExchangeAccount[]> {
		return await Db.getMultiple(accountId, 'EXCHANGE#');
	},
	async create(account: DbExchangeAccountInput): Promise<void> {
		let exchange: DbExchangeAccount = {
			...account,
			resourceId: `EXCHANGE#${account.id}`
		};
		return await Db.put( exchange );
	},
	async update(accountId: string, exchangeId: string, update: any ){
		return await Db.update(accountId, `EXCHANGE#${exchangeId}`, update);
	},
	async delete({accountId, exchangeAccountId}: DeleteExchangeAccountInput){
		return await Db.del(accountId, `EXCHANGE#${exchangeAccountId}`);
	}
}


function getLastPortfolioFileName(accountId: string, exchangeId: string) {
	return `${accountId}/ex-${exchangeId}/logs`;
}
function getPortfolioHistoryFileName(accountId: string, exchangeId: string) {
	return `${accountId}/ex-${exchangeId}/state`;
}
function getOrdersFileName(accountId: string, exchangeId: string) {
	return `${accountId}/ex-${exchangeId}/orders`;
}

function getLastPortfolio(accountId: string, exchangeId: string) {
	return s3Helper.getContent(getLastPortfolioFileName(accountId, exchangeId));
}
function getPortfolioHistory(accountId: string, exchangeId: string) {
	return s3Helper.getContent(getPortfolioHistoryFileName(accountId, exchangeId));
}
function getOrders(accountId: string, exchangeId: string) {
	return s3Helper.getContent(getOrdersFileName(accountId, exchangeId));
}

function saveLastPortfolio(accountId: string, exchangeId: string, logs: string) {
	return s3Helper.setContent(getLastPortfolioFileName(accountId, exchangeId), logs);
}
function savePortfolioHistory(accountId: string, exchangeId: string, state: string) {
	return s3Helper.setContent(getPortfolioHistoryFileName(accountId, exchangeId), state);
}
function saveOrders(accountId: string, exchangeId: string, orders: string) {
	return s3Helper.setContent(getOrdersFileName(accountId, exchangeId), orders);
}

function delLastPortfolio(accountId: string, exchangeId: string) {
	return s3Helper.delObject(getLastPortfolioFileName(accountId, exchangeId));
}
function delPortfolioHistory(accountId: string, exchangeId: string) {
	return s3Helper.delObject(getPortfolioHistoryFileName(accountId, exchangeId));
}
function delOrders(accountId: string, exchangeId: string) {
	return s3Helper.delObject(getOrdersFileName(accountId, exchangeId));
}