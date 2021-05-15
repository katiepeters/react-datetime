import { ContextResult, Mutation, MutationContextInput, MutationGetterInput, MutationHandler, MutationResponseInput, ResponseResult } from "../apitron.types";
import { validateShape } from "../utils/validators";
import { v4 as uuid } from 'uuid';
interface CreateDeploymentInput {
	name: string
	accountId: string
	botId: string
	exchangeAccountId: string
	runInterval: string
	symbols: string[]
	active?: boolean
}

const createDeploymentHandler: MutationHandler = {
	name: 'createDeployment',
	async getContext({body, models}: MutationContextInput<CreateDeploymentInput>): Promise<ContextResult> {
		// Validate input
		let {error} = validateShape(body, {
			name: 'string',
			accountId: 'string',
			botId: 'string',
			active: 'boolean?',
			exchangeAccountId: 'string',
			runInterval: 'runInterval',
			symbols: 'symbols'
		});

		if( error ) {
			return {error: {
				code: 'invalid_payload',
				reason: error.message.replace('{field}', error.field || '')
			}};
		}

		// Validate entities
		let [account, bot, exchange] = await Promise.all([
			models.account.getSingle(body.accountId),
			models.bot.getSingle(body.accountId, body.botId),
			models.exchangeAccount.getSingle(body.accountId, body.exchangeAccountId)
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
				...input.body,
				id,
				state: { newState: 'stateNew' },
				active: input.body.active === undefined ? true : input.body.active
			}
		}];
	},

	getResponse(input: MutationResponseInput): ResponseResult {
		return {
			status: 201,
			data: {id: input.mutations[0].data.id }
		};
	}
}

export default createDeploymentHandler;