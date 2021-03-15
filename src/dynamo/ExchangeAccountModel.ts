import { TableItem, DBModel } from './db';

interface DbExchangeAccount extends TableItem {
	provider: 'bitfinex'
	type: 'real' | 'virtual'
	key: string
	secret: string
}

interface DbExchangeAccountInput {
	accountId: string
	exchangeAccountId: string
	provider: 'bitfinex'
	type: 'real' | 'virtual'
	key: string
	secret: string
}

const Db = new DBModel<DbExchangeAccount>();

export default {
	async getSingle(accountId: string, resourceId: string): Promise<DbExchangeAccount | void> {
		return await Db.getSingle(accountId, resourceId);
	},
	async create(account: DbExchangeAccountInput): Promise<void> {
		let exchange: DbExchangeAccount = {
			...account,
			resourceId: `EXCHANGE#${account.exchangeAccountId}`
		};
		delete exchange.exchangeAccountId;
		return await Db.put( exchange );
	}
}
