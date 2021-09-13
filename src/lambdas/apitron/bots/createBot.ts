import { ContextResult, Mutation, MutationContextInput, MutationGetterInput, MutationHandler, MutationResponseInput, ResponseResult } from "../apitron.types";
import { validateShape } from "../utils/validators";
import { v4 as uuid } from 'uuid';
import { DbBotInput } from "../../model.types";
import { DbBotVersionCreateInput } from "../../_common/dynamo/BotVersionModel";
import { createId } from "../../_common/utils/resourceId";

const createBotHandler: MutationHandler = {
	name: 'createBot',
	async getContext({body, params, models}: MutationContextInput<any>): Promise<ContextResult> {
		// Validate input
		let {error} = validateShape(body, {
			accountId: 'string',
			name: 'string',
			code: 'string'
		});
		if( error ) return {error: {...error, code: 'invalid_payload'}};

		return {context: {}};
	},

	getMutations(input: MutationGetterInput): Mutation[] {
		const {accountId, name, code} = input.body;
		const id = createId();
		const bot: DbBotInput = {
				id,
				accountId,
				name,
				versions: [
					{ lastMinor: 0, available:[{number: 0, createdAt: Date.now()}] }
				]
		};
		const version: DbBotVersionCreateInput = {
			botId: `${id}${accountId}`,
			number: '0.0',
			code
		};

		return [
			{model: 'bot', action: 'create',	data: bot},
			{model: 'botVersion', action: 'create', data: version}
		];
	},

	getResponse(input: MutationResponseInput): ResponseResult {
		return {
			status: 201,
			data: {id: input.mutations[0].data.id}
		};
	}
}

export default createBotHandler;