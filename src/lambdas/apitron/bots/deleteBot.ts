import { ContextResult, Mutation, MutationContextInput, MutationGetterInput, MutationHandler, MutationResponseInput, ResponseResult } from "../apitron.types";
import { validateShape } from "../utils/validators";

const deleteBotHandler: MutationHandler = {
	name: 'deleteBot',
	async getContext({body, params, query, models}: MutationContextInput<any>): Promise<ContextResult> {
		const { botId } = params;
		const { accountId } = query;

		// Validate input
		let { error } = validateShape({ botId, accountId }, {
			accountId: 'string',
			botId: 'string'
		});
		if (error) return { error: { ...error, code: 'invalid_request' } };

		const bot = await models.bot.getSingle(accountId, botId);
		if (!bot) {
			return { error: { code: 'not_found', reason: 'bot not found', status: 404 } };
		}

		return { context: { accountId, botId } };
	},

	getMutations(input: MutationGetterInput): Mutation[] {
		return [{
			model: 'bot',
			action: 'delete',
			data: input.context
		}];
	},

	getResponse(input: MutationResponseInput): ResponseResult {
		return {
			status: 204,
			data: {}
		};
	}
}

export default deleteBotHandler;