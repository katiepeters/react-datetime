import { DbBot, DbBotInput } from '../../model.types';
import { DBModel } from './db';

interface DeleteBotInput {
	accountId: string
	botId: string
}

interface UpdateBotInput {
	accountId: string
	botId: string
	update: any
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

	async update({accountId, botId, update}: UpdateBotInput ): Promise<void> {
		console.log( {accountId, botId, update });
		return await Db.update(accountId, `BOT#${botId}`, update);
	},

	async delete({accountId, botId}: DeleteBotInput): Promise<void> {
		return await Db.del( accountId, `BOT#${botId}` );
	}
}