import { DbBot, DbBotInput, DynamoBot, ModelBot } from '../../model.types';
import { parseId } from '../utils/resourceId';
import { DBModel } from './db';

interface UpdateBotInput {
	botId: string
	update: any
}

const Db = new DBModel<DynamoBot>();

export default {
	async getSingle(compoundId: string): Promise<ModelBot | void> {
		const {accountId, resourceId} = parseId(compoundId);
		const bot = await Db.getSingle(accountId, `BOT#${resourceId}`);
		if( bot ){
			return dynamoToModel(bot);
		}
	},
	async getAccountBots( accountId: string ): Promise<ModelBot[]> {
		return (await Db.getMultiple( accountId, 'BOT#')).map(dynamoToModel);
	},
	async create(input: DbBotInput): Promise<void> {
		const {id, ...baseBot} = input;
		let bot: DbBot = {
			createdAt: Date.now(),
			...input,
			resourceId: `BOT#${id}`
		};
		delete bot.botId;
		return await Db.put(bot);
	},

	async update({botId, update}: UpdateBotInput ): Promise<void> {
		const {accountId, resourceId} = parseId(botId);
		console.log( {accountId, botId, update });
		return await Db.update(accountId, `BOT#${resourceId}`, update);
	},

	async delete(botId: string): Promise<void> {
		const {accountId, resourceId} = parseId(botId);
		return await Db.del( accountId, `BOT#${resourceId}` );
	}
}

function dynamoToModel( dynamoBot: DynamoBot ): ModelBot {
	const {resourceId, accountId, ...baseBot} = dynamoBot;
	let rid = resourceId.replace('BOT#', '') + accountId;
	let model = {
		id: rid,
		accountId,
		...baseBot
	};

	console.log('more more', model, rid );
	return model;
}

function modelToDynamo( modelbot: ModelBot ): DynamoBot {
	const {id, ...baseBot} = modelbot;
	const {resourceId} = parseId(id);
	return {
		resourceId: `BOT#${resourceId}`,
		...baseBot
	}
}