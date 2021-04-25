import { QueryContextInput, QueryHandler, ContextResult, QueryResponseInput, ResponseResult } from "../apitron.types";
import { validateShape } from "../utils/validators";

const getSingleBotHandler: QueryHandler = {
	name: 'getSingleBot',
	async getContext({ params, query, models }: QueryContextInput): Promise<ContextResult> {
		const { botId } = params;
		const { accountId } = query;

		const { error } = validateShape({ botId, accountId }, {
			botId: 'string',
			accountId: 'string'
		});
		if (error) return { error: { ...error, code: 'invalid_request' } };

		const bot = models.bot.getSingle(accountId, botId);
		if (!bot) return { error: { code: 'not_found', status: 404 } };

		return { context: { bot } };
	},

	getResponse({ params, context }: QueryResponseInput): ResponseResult {
		return {status: 200, data: context.bot};
	}
}

export default getSingleBotHandler;