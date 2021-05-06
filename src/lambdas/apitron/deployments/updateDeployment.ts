import { ContextResult, Mutation, MutationContextInput, MutationGetterInput, MutationHandler, MutationResponseInput, ResponseResult } from "../apitron.types";
import { validateShape } from "../utils/validators";

interface UpdateDeploymentInput {
	accountId: string
	active: boolean
}

const updateDeploymentHandler: MutationHandler = {
	name: 'updateDeployment',
	async getContext({body, params, models}: MutationContextInput<any>): Promise<ContextResult> {
		// Validate input
		let {error} = validateShape(body, {
			accountId: 'string',
			active: 'boolean'
		});
		if( error ) return {error: {...error, code: 'invalid_payload'}};

		const deployment = await models.deployment.getSingle(body.accountId, params.deploymentId);
		if( !deployment ){
			return {error: {code: 'not_found', reason: 'deployment not found', status: 404}};
		}

		return {context: {deployment}};
	},

	getMutations(input: MutationGetterInput): Mutation[] {
		const {deployment} = input.context;
		const {active, accountId} = input.body;

		if( deployment.active === active ){
			return [];
		}

		return [{
			model: 'deployment',
			action: active ? 'activate' : 'deactivate',
			data: {
				accountId,
				deploymentId: input.params.deploymentId
			}
		}];
	},

	getResponse(input: MutationResponseInput): ResponseResult {
		return {
			status: 200,
			data: {
				id: input.params.deploymentId,
				result: input.mutations.length ? 'updated' : 'no updated needed'
			}
		};
	}
}

export default updateDeploymentHandler;