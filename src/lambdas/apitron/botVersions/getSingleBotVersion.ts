import { QueryContextInput, QueryHandler, ContextResult, QueryResponseInput, ResponseResult } from "../apitron.types";
import { validateShape } from "../utils/validators";

const getSingleBotVersionHandler: QueryHandler = {
	name: 'getSingleBotVersion',
	async getContext({ params, query, models }: QueryContextInput): Promise<ContextResult> {
		const { number } = params;
		const {botId} = query;
		
		const { error } = validateShape({ number, botId }, {
			botId: 'string',
			number: 'botVersion'
		});

		if (error) return { error: { ...error, code: 'invalid_request' } };

		const version = await models.botVersion.getSingle(botId, number);
		if( !version ){
			return { error: {code: 'bot_version_not_found'}};
		}

		return {context: {version}};
	},

	getResponse({ params, context }: QueryResponseInput): ResponseResult {
		return {status: 200, data: context.version};
	}
}

export default getSingleBotVersionHandler;