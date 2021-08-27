import { QueryContextInput, QueryHandler, ContextResult, QueryResponseInput, ResponseResult } from "../apitron.types";
import { validateShape } from "../utils/validators";

const getSingleDeploymentHandler: QueryHandler = {
	name: 'getSingleDeployment',
	async getContext({ params, query, models }: QueryContextInput): Promise<ContextResult> {
		const { deploymentId } = params;
		const { accountId } = query;

		const {error} = validateShape({deploymentId, accountId}, {
			deploymentId: 'string',
			accountId: 'string'
		});
		if (error) return { error: { ...error, code: 'invalid_request' } };

		const deployment = await models.deployment.getSingleFull(accountId, deploymentId);
		if (!deployment) {
			return { error: { code: 'not_found', reason: 'deployment not found', status: 404 } };
		}

		return {context: {deployment}};
	},

	getResponse({ params, context }: QueryResponseInput): ResponseResult {
		return {status: 200, data: context.deployment};
	}
}

export default getSingleDeploymentHandler;