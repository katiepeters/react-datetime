import { DBModel } from './db';
import { DbExchangeAccount, DbExchangeAccountInput } from '../../model.types';

const Db = new DBModel<DbExchangeAccount>();

interface DeleteExchangeAccountInput {
	accountId: string
	exchangeAccountId: string
}

export default {
	async getSingle(accountId: string, exchangeId: string): Promise<DbExchangeAccount | void> {
		return await Db.getSingle(accountId, `EXCHANGE#${exchangeId}`);
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
