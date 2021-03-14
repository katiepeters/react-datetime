import {TableItem, DBModel} from './db';

interface DBAccount extends TableItem {
	resourceId: 'ACCOUNT'
}

interface DBAccountInput {
	accountId: string
}

const Db = new DBModel<DBAccount>();

export default {
	async getSingle(accountId:string): Promise<DBAccount | void> {
		return await Db.getSingle(accountId, 'ACCOUNT');
	},
	async create(account: DBAccountInput): Promise<void> {
		return await Db.put({
			...account,
			resourceId: 'ACCOUNT'
		});
	}
}