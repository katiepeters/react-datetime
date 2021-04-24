import { ContextResult, Mutation, MutationContextInput, MutationGetterInput, MutationHandler, MutationResponseInput, ResponseResult } from "../apitron.types";
import { validateShape } from "../utils/validators";

const deleteDeploymentHandler: MutationHandler = {
	name: 'deleteDeployment',
	async getContext({params, query, models}: MutationContextInput<any>): Promise<ContextResult> {
		const {deploymentId} = params;
		const {accountId} = query;

		// Validate input
		let { error } = validateShape({deploymentId, accountId}, {
			accountId: 'string',
			deploymentId: 'string'
		});
		if (error) return { error: { ...error, code: 'invalid_request' } };

		const deployment = await models.deployment.getSingle(accountId, deploymentId);
		if (!deployment) {
			return { error: { code: 'not_found', reason: 'deployment not found', status: 404 } };
		}

		return {context: {accountId, deploymentId}};
	},

	getMutations(input: MutationGetterInput): Mutation[] {
		return [{
			model: 'deployment',
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

export default deleteDeploymentHandler;