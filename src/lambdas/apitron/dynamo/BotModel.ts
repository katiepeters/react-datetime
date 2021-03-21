import { TableItem, DBModel } from './db';

interface DbBot extends TableItem {
	id: string
	name: string
	code: string
}

interface DbBotInput {
	id: string
	name: string
	accountId: string
	code: string
}


const Db = new DBModel<DbBot>();

export default {
	async getSingle(accountId: string, botId: string): Promise<DbBot | void> {
		return await Db.getSingle(accountId, `BOT#${botId}`);
	},
	async getAccountBots( accountId: string ) {
		return await Db.getMultiple( accountId, 'BOT#');
	},
	async create(input: DbBotInput): Promise<void> {
		let bot: DbBot = {
			...input,
			resourceId: `BOT#${input.id}`
		};
		delete bot.botId;
		return await Db.put(bot);
	},

	async update(accountId: string, botId: string, updateData: any ): Promise<void> {
		return await Db.update(accountId, `BOT#${botId}`, updateData);
	}
}