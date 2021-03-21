import { TableItem, DBModel } from './db';

interface DbExchangeAccount extends TableItem {
	id: string
	provider: 'bitfinex'
	type: 'real' | 'virtual'
	key: string
	secret: string
}

interface DbExchangeAccountInput {
	accountId: string
	id: string
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
			resourceId: `EXCHANGE#${account.id}`
		};
		return await Db.put( exchange );
	}
}
