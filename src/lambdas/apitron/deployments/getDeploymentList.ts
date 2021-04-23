import { QueryContextInput, QueryHandler, ContextResult, QueryResponseInput, ResponseResult } from "../apitron.types";

const getDeploymentListHandler: QueryHandler = {
	name: 'getDeploymentList',
	async getContext({ params, models }: QueryContextInput): Promise<ContextResult> {
		if( !params.accountId ){
			return { error: { code: 'invalid_payload', reason: 'missing accountId'} };
		}

		let deployments = await models.deployment.getAccountDeployments( params.accountId );

		return { context: deployments };
	},

	getResponse({ params, context }: QueryResponseInput): ResponseResult {
		return {status: 200, data: context};
	}
}

export default getDeploymentListHandler;