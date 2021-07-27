import { DbBotVersion } from '../../model.types';
import { DBModel } from './db';

const Db = new DBModel<DbBotVersion>();

export interface DbBotVersionCreateInput {
	accountId: string
	botId: string
	number: string
	code?: string
	isLocked?: boolean
	label?: string
	createdAt?: number
	updatedAt?: number
}

export interface DbBotVersionUpdateInput {
	accountId: string
	botId: string
	number: string
	code?: string
	isLocked?: boolean
	label?: string
}

export interface DbBotVersionDeleteInput {
	accountId: string
	botId: string
	number: string
}

export default {
	async getSingle(accountId: string, botId: string, versionNumber: string ){
		return await Db.getSingle(accountId, `BOTVERSION#${botId}#${versionNumber}`);
	},

	async create(input: DbBotVersionCreateInput){
		let version: DbBotVersion = {
			code: '',
			createdAt: Date.now(),
			updatedAt: Date.now(),
			isLocked: false,
			label: '',
			...input,
			resourceId: `BOTVERSION#${input.botId}#${input.number}`
		};

		return await Db.put(version);
	},

	async update(input: DbBotVersionUpdateInput){
		let update:any = {
			updatedAt: Date.now()
		};

		if( input.code !== undefined ){
			update.code = input.code
		}
		if( input.isLocked !== undefined ){
			update.isLocked = input.isLocked
		}
		if( input.label !== undefined ){
			update.label = input.label;
		}

		return await Db.update(
			input.accountId,
			`BOTVERSION#${input.botId}#${input.number}`,
			update
		);
	},

	async delete(input: DbBotVersionDeleteInput){
		return await Db.del(
			input.accountId,
			`BOTVERSION#${input.botId}#${input.number}`
		);
	}
}