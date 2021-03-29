import { DBModel } from './db';
import { DbExchangeAccount, DbExchangeAccountInput } from '../../model.types';

const Db = new DBModel<DbExchangeAccount>();

export default {
	async getSingle(accountId: string, exchangeId: string): Promise<DbExchangeAccount | void> {
		return await Db.getSingle(accountId, `EXCHANGE#${exchangeId}`);
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
	}
}
