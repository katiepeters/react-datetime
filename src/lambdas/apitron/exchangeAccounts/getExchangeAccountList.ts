import { QueryContextInput, QueryHandler, ContextResult, QueryResponseInput, ResponseResult } from "../apitron.types";
import { validateShape } from "../utils/validators";

const getExchangeAccountListHandler: QueryHandler = {
	name: 'getExchangeAccountList',
	async getContext({ query, models }: QueryContextInput): Promise<ContextResult> {
		const {accountId} = query;
		const {error} = validateShape({accountId},{accountId: 'string'});
		if (error) return { error: { ...error, code: 'invalid_request' } };

		const exchangeAccounts = models.exchangeAccount.getAccountExchanges(accountId);
		return {context: {exchangeAccounts}};
	},

	getResponse({ context }: QueryResponseInput): ResponseResult {
		return {status: 200, data: context.exchangeAccounts};
	}
}

export default getExchangeAccountListHandler;