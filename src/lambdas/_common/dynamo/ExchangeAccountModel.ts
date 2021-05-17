import { DBModel } from './db';
import { DbExchangeAccount, DbExchangeAccountInput, ExchangeAccountWithHistory, PortfolioHistoryItem } from '../../model.types';
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

	async getSingleWithHistory( accountId: string, exchangeId: string ): Promise<ExchangeAccountWithHistory | void> {
		let dbExchange = await this.getSingle( accountId, exchangeId );
		if( !dbExchange ) return;

		let history = await getPortfolioHistory(accountId, exchangeId);

		return {
			...dbExchange,
			portfolioHistory: JSON.parse(history)
		}
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

	async updatePortfolio( accountId: string, exchangeId: string, portfolio: Portfolio, updateLast: boolean ){
		let historyRaw = await getPortfolioHistory(accountId, exchangeId) || '[]';
		let history: PortfolioHistoryItem[] = JSON.parse(historyRaw);
		history.push({
			date: Date.now(),
			balances: portfolio
		});

		let results = await Promise.all([
			savePortfolioHistory(accountId, exchangeId, JSON.stringify(history) ),
			updateLast && saveLastPortfolio(accountId, exchangeId, JSON.stringify(portfolio) )
		]);

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
		
		console.log('Createing exchange and portfolio history');
		let promises = [
			Db.put(exchange),
			savePortfolioHistory(
				accountId, exchangeId,
				JSON.stringify(account.initialBalances ? [account.initialBalances] : [] )
			)
		];

		if (account.type === 'virtual') {
			console.log('Createing last portfolio and orders');
			promises = [...promises, ...[
				saveLastPortfolio( accountId, exchangeId, JSON.stringify(account.initialBalances)),
				saveOrders( accountId, exchangeId, '{}')
			]];
		}

		await Promise.all( promises );
	},
	async update(accountId: string, exchangeId: string, update: any ){
		return await Db.update(accountId, `EXCHANGE#${exchangeId}`, update);
	},
	async delete({accountId, exchangeAccountId, deleteExtra}: DeleteExchangeAccountInput){
		let promises = [
			Db.del(accountId, `EXCHANGE#${exchangeAccountId}`),
			delPortfolioHistory(accountId, exchangeAccountId)
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
function getPortfolioHistoryFileName(accountId: string, exchangeId: string) {
	return `${accountId}/ex-${exchangeId}/portfolioHistory`;
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