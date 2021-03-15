import { TableItem, DBModel } from './db';

interface DbBot extends TableItem {
	code: string
}

interface DbBotInput {
	accountId: string
	botId: string
	code: string
}


const Db = new DBModel<DbBot>();

export default {
	async getSingle(accountId: string, resourceId: string): Promise<DbBot | void> {
		return await Db.getSingle(accountId, resourceId);
	},
	async create(input: DbBotInput): Promise<void> {
		let bot: DbBot = {
			...input,
			resourceId: `BOT#${input.botId}`
		};
		delete bot.botId;
		return await Db.put(bot);
	}
}