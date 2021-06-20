import { DBAccount, DBAccountInput } from '../../model.types';
import {DBModel} from './db';

const Db = new DBModel<DBAccount>();

export default {
	async getSingle(id:string): Promise<DBAccount | void> {
		return await Db.getSingle(id, 'ACCOUNT');
	},
	async create(account: DBAccountInput): Promise<void> {
		return await Db.put({
			createdAt: Date.now(),
			...account,
			accountId: account.id,
			resourceId: 'ACCOUNT'
		});
	}
}