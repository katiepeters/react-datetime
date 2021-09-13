import { DbBotVersion } from '../../model.types';
import { parseId } from '../utils/resourceId';
import { DBModel } from './db';

const Db = new DBModel<DbBotVersion>();

export interface DbBotVersionCreateInput {
	botId: string
	number: string
	code?: string
	isLocked?: boolean
	label?: string
	createdAt?: number
	updatedAt?: number
}

export interface DbBotVersionUpdateInput {
	botId: string
	number: string
	code?: string
	isLocked?: boolean
	label?: string
}

export interface DbBotVersionDeleteInput {
	botId: string
	number: string
}

export default {
	async getSingle(compoundId: string, versionNumber: string ){
		const {accountId, resourceId: botId} = parseId(compoundId);
		return await Db.getSingle(accountId, `BOTVERSION#${botId}#${versionNumber}`);
	},

	async create(input: DbBotVersionCreateInput){
		const {accountId, resourceId: botId} = parseId(input.botId);
		let version: DbBotVersion = {
			code: '',
			createdAt: Date.now(),
			updatedAt: Date.now(),
			isLocked: false,
			label: '',
			...input,
			accountId,
			resourceId: `BOTVERSION#${botId}#${input.number}`
		};

		return await Db.put(version);
	},

	async update(input: DbBotVersionUpdateInput){
		const {accountId, resourceId: botId} = parseId(input.botId);
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
			accountId,
			`BOTVERSION#${botId}#${input.number}`,
			update
		);
	},

	async delete(input: DbBotVersionDeleteInput){
		const {accountId, resourceId: botId} = parseId(input.botId);
		return await Db.del(
			accountId,
			`BOTVERSION#${botId}#${input.number}`
		);
	}
}