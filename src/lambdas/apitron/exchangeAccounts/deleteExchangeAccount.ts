import { ContextResult, Mutation, MutationContextInput, MutationGetterInput, MutationHandler, MutationResponseInput, ResponseResult } from "../apitron.types";
import { validateShape } from "../utils/validators";

const deleteExchangeAccountHandler: MutationHandler = {
	name: 'deleteExchangeAccount',
	async getContext({ query, params, models }: MutationContextInput<any>): Promise<ContextResult> {
		const { exchangeAccountId } = params;

		// Validate input
		let { error } = validateShape({ exchangeAccountId }, {
			exchangeAccountId: 'string'
		});
		if (error) return { error: { ...error, code: 'invalid_request' } };

		const exchangeAccount = await models.exchangeAccount.getSingle(exchangeAccountId);
		if (!exchangeAccount) return { error: { code: 'not_found', status: 404 } };


		return {context: {
			id: exchangeAccountId,
			deleteExtra: exchangeAccount.type === 'virtual'
		}};
	},

	getMutations(input: MutationGetterInput): Mutation[] {
		return [{
			model: 'exchangeAccount',
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

export default deleteExchangeAccountHandler;