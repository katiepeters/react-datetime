import { QueryContextInput, QueryHandler, ContextResult, QueryResponseInput, ResponseResult } from "../apitron.types";

const getDeploymentListHandler: QueryHandler = {
	name: 'getDeploymentList',
	async getContext({ query, models }: QueryContextInput): Promise<ContextResult> {
		if( !query.accountId ){
			return { error: { code: 'invalid_payload', reason: 'missing accountId'} };
		}

		let deployments = await models.deployment.getAccountDeployments( query.accountId );

		return { context: deployments };
	},

	getResponse({ context }: QueryResponseInput): ResponseResult {
		return {status: 200, data: context};
	}
}

export default getDeploymentListHandler;