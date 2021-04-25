import { ContextResult, Mutation, MutationContextInput, MutationGetterInput, MutationHandler, MutationResponseInput, ResponseResult } from "../apitron.types";
import { validateShape } from "../utils/validators";
import {v4 as uuid} from 'uuid';

const createExchangeAccountHandler: MutationHandler = {
	name: 'createExchangeAccount',
	async getContext({body, params, models}: MutationContextInput<any>): Promise<ContextResult> {
		// Validate input
		let {error} = validateShape(body, {
			accountId: 'string',
			provider: 'provider',
			type: 'providerType',
			key: 'string',
			secret: 'string'
		});
		if( error ) return {error: {...error, code: 'invalid_payload'}};

		let account = await models.account.getSingle(body.accountId);
		if( !account ){
			return {error: {code: 'unknown_account'}};
		}

		return {context: {}};
	},

	getMutations(input: MutationGetterInput): Mutation[] {
		const {accountId, provider, type, key, secret} = input.body;
		let data = {
			id: uuid(),
			accountId, provider, type, key, secret
		}
		return [{
			model: 'exchangeAccount',
			action: 'create',
			data
		}];
	},

	getResponse(input: MutationResponseInput): ResponseResult {
		return {
			status: 201,
			data: {id: input.mutations[0].data.id}
		};
	}
}

export default createExchangeAccountHandler;