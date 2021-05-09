import { QueryContextInput, QueryHandler, ContextResult, QueryResponseInput, ResponseResult } from "../apitron.types";

const getBotListHandler: QueryHandler = {
	name: 'getBotList',
	async getContext({ query, models }: QueryContextInput): Promise<ContextResult> {
		if (!query.accountId) {
			return { error: { code: 'invalid_payload', reason: 'missing accountId' } };
		}

		let bots = await models.bot.getAccountBots(query.accountId);
		return { context: bots };
	},

	getResponse({ params, context }: QueryResponseInput): ResponseResult {
		return {status: 200, data: context};
	}
}

export default getBotListHandler;