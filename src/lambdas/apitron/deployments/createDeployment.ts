import { ContextResult, Mutation, MutationContextInput, MutationGetterInput, MutationHandler, MutationResponseInput, ResponseResult } from "../apitron.types";
import { validateShape } from "../utils/validators";
import { v4 as uuid } from 'uuid';
import { CreateBotDeploymentModelInput } from "../../_common/dynamo/DeploymentTypes";
interface CreateDeploymentInput {
	name: string
	accountId: string
	version: string
	botId: string
	exchangeAccountId: string
	runInterval: string
	pairs: string[]
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
			version: 'string',
			active: 'boolean?',
			exchangeAccountId: 'string',
			runInterval: 'runInterval',
			pairs: 'pairs'
		});

		if( error ) {
			return {error: {
				code: 'invalid_payload',
				reason: error.message.replace('{field}', error.field || '')
			}};
		}

		// Validate entities
		const {accountId, botId, version: versionNumber, exchangeAccountId} = body;
		let [version, exchange] = await Promise.all([
			models.botVersion.getSingle(accountId, botId, versionNumber),
			models.exchangeAccount.getSingle(accountId, exchangeAccountId)
		]);

		if( !version ) return {error: {code: 'unknown_version'}};
		if( !exchange ) return {error: {code: 'unknown_exchange_account'}};

		// No need of any special info for the context
		return {context: {}};
	},

	getMutations(input: MutationGetterInput): Mutation[] {
		const id = uuid();

		let deployment: CreateBotDeploymentModelInput = {
			id,
			...input.body,
			state: { newState: 'stateNew' },
			active: input.body.active === undefined ? true : input.body.active
		};

		return [{
			model: 'deployment',
			action: 'create',
			data: deployment
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