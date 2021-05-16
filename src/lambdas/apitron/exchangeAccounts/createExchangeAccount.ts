import { ContextResult, Mutation, MutationContextInput, MutationGetterInput, MutationHandler, MutationResponseInput, ResponseResult } from "../apitron.types";
import { validateShape } from "../utils/validators";
import {v4 as uuid} from 'uuid';

const createExchangeAccountHandler: MutationHandler = {
	name: 'createExchangeAccount',
	async getContext({body, params, models}: MutationContextInput<any>): Promise<ContextResult> {
		// Validate input
		let {error} = validateShape(body, getValidShape( body.type ));
		if( error ) return {error: {...error, code: 'invalid_payload'}};

		let account = await models.account.getSingle(body.accountId);
		if( !account ){
			return {error: {code: 'unknown_account'}};
		}

		return {context: {}};
	},

	getMutations(input: MutationGetterInput): Mutation[] {
		const {accountId, provider, type, key, secret, name, initialBalances} = input.body;
		let data = {
			id: uuid(),
			accountId, provider, type, key, secret, name, initialBalances
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


function getValidShape( type ){
	if( type === 'real' ){
		return {
			name: 'string',
			accountId: 'string',
			provider: 'provider',
			type: 'providerType',
			key: 'string',
			secret: 'string'
		};
	}

	return {
		name: 'string',
		accountId: 'string',
		provider: 'provider',
		type: 'providerType',
		initialBalances: 'portfolio'
	};
}