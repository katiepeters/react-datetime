import { QueryContextInput, QueryHandler, ContextResult, QueryResponseInput, ResponseResult } from "../apitron.types";
import { validateShape } from "../utils/validators";
import toExchangeResponse from "./utils/toExchangeResponse";

const getSingleExchangeAccountHandler: QueryHandler = {
	name: 'getSingleExchangeAccount',
	async getContext({ params, query, models }: QueryContextInput): Promise<ContextResult> {
		const {exchangeAccountId} = params;

		const {error} = validateShape({exchangeAccountId}, {
			exchangeAccountId: 'string'
		});
		if (error) return { error: { ...error, code: 'invalid_request' } };

		const exchangeAccount = await models.exchangeAccount.getSingle(exchangeAccountId);
		console.log( exchangeAccount );
		if( !exchangeAccount ) return {error:{code: 'not_found', status: 404}};

		return {context: {exchangeAccount}};
	},

	getResponse({ params, context }: QueryResponseInput): ResponseResult {
		return {status: 200, data: toExchangeResponse(context.exchangeAccount) };
	}
}

export default getSingleExchangeAccountHandler;