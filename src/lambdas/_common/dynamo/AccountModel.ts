import {TableItem, DBModel} from './db';

interface DBAccount extends TableItem {
	id: string
	resourceId: 'ACCOUNT'
}

interface DBAccountInput {
	id: string
}

const Db = new DBModel<DBAccount>();

export default {
	async getSingle(id:string): Promise<DBAccount | void> {
		return await Db.getSingle(id, 'ACCOUNT');
	},
	async create(account: DBAccountInput): Promise<void> {
		return await Db.put({
			...account,
			accountId: account.id,
			resourceId: 'ACCOUNT'
		});
	}
}