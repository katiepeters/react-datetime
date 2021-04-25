import { ContextResult, Mutation, MutationContextInput, MutationGetterInput, MutationHandler, MutationResponseInput, ResponseResult } from "../apitron.types";
import { validateShape } from "../utils/validators";
import { v4 as uuid } from 'uuid';

const createBotHandler: MutationHandler = {
	name: 'createBot',
	async getContext({body, params, models}: MutationContextInput<any>): Promise<ContextResult> {
		// Validate input
		let {error} = validateShape(body, {
			accountId: 'string',
			name: 'string',
			code: 'string'
		});
		if( error ) return {error: {...error, code: 'invalid_payload'}};

		return {context: {}};
	},

	getMutations(input: MutationGetterInput): Mutation[] {
		const {accountId, name, code} = input.body;
		return [{
			model: 'bot',
			action: 'create',
			data: {
				id: uuid(),
				accountId,
				name,
				code
			}
		}];
	},

	getResponse(input: MutationResponseInput): ResponseResult {
		return {
			status: 201,
			data: {id: input.mutations[0].data.id}
		};
	}
}

export default createBotHandler;