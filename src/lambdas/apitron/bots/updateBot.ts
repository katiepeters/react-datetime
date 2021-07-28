import { ContextResult, Mutation, MutationContextInput, MutationGetterInput, MutationHandler, MutationResponseInput, ResponseResult } from "../apitron.types";
import { validateShape } from "../utils/validators";


const updateBotHandler: MutationHandler = {
	name: 'updateBot',
	async getContext({body, params, query, models}: MutationContextInput<any>): Promise<ContextResult> {
		// Validate input
		let { accountId } = query;
		let { botId } = params;
		let {error} = validateShape({...body, accountId, botId}, {
			code: 'string?',
			name: 'string?',
			accountId: 'string',
			botId: 'string'
		});
		if( error ) return {error: {...error, code: 'invalid_payload'}};

		const bot = await models.bot.getSingle(accountId, botId);
		if( !bot ) return {error: {code: 'not_found', status: 404}};

		return {context: {accountId, botId}};
	},

	getMutations(input: MutationGetterInput): Mutation[] {
		const update:any = {};
		const {accountId, botId} = input.context;
		if( input.body.code ){
			update.code = input.body.code;
		}
		if (input.body.name) {
			update.name = input.body.name;
		}
		return [{
			model: 'bot',
			action: 'update',
			data: {
				accountId, botId, update
			}
		}];
	},

	getResponse(input: MutationResponseInput): ResponseResult {
		return {
			status: 200,
			data: {id: input.params.botId}
		};
	}
}

export default updateBotHandler;