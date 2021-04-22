import { ContextResult, Mutation, MutationContextInput, MutationGetterInput, MutationHandler, MutationResponseInput, ResponseResult } from "../apitron.types";
import { validateShape } from "../utils/validators";

const uuid = require('uuid/dist/v4').default;

const createDeploymentHandler: MutationHandler = {
	name: 'createDeployment',
	async getContext({body, models}: MutationContextInput): Promise<ContextResult> {
		// Validate input
		let {error} = validateShape(body, {
			accountId: 'string',
			botId: 'string',
			config: {
				exchangeAccountId: 'string',
				interval: 'interval',
				symbols: 'symbols'
			}
		});
		if( error ) return {error: {...error, code: 'invalid_payload'}};

		// Validate entities
		let [account, bot, exchange] = await Promise.all([
			models.account.getSingle(body.accountId),
			models.bot.getSingle(body.accountId, body.botId),
			models.exchangeAccount.getSingle(body.accountId, body.config.exchangeAccountId)
		]);

		if( !account ) return {error: {code: 'unknown_account'}};
		if( !bot ) return {error: {code: 'unknonw_bot'}};
		if( !exchange ) return {error: {code: 'unknown_exchange_account'}};

		// No need of any special info for the context
		return {context: {}};
	},

	getMutations(input: MutationGetterInput): Mutation[] {
		const id = uuid();
		return [{
			model: 'deployment',
			action: 'create',
			data: {
				...input,
				id,
				orders: [],
				state: {}
			}
		}];
	},

	getResponse(input: MutationResponseInput): ResponseResult {
		return {
			status: 201,
			data: {}
		};
	}
}

export default createDeploymentHandler;