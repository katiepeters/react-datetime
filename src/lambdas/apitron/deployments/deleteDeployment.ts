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

		const deployment = await models.deployment.getSingleModel(accountId, deploymentId);
		if (!deployment) {
			return { error: { code: 'not_found', reason: 'deployment not found', status: 404 } };
		}

		const exchange = await models.exchangeAccount.getSingle(accountId, deployment.exchangeAccountId);

		return {context: {
			deployment: {accountId, deploymentId },
			exchange
		}};
	},

	getMutations(input: MutationGetterInput): Mutation[] {
		const {deployment, exchange} = input.context;
		let mutations = [{
			model: 'deployment',
			action: 'delete',
			data: deployment
		}];
		
		if( exchange && exchange.type === 'virtual' ){
			mutations.push({
				model: 'exchangeAccount',
				action: 'delete',
				data: {
					accountId: exchange.accountId,
					exchangeAccountId: exchange.id,
					deleteExtra: true
				}
			});
		}

		return mutations;
	},

	getResponse(input: MutationResponseInput): ResponseResult {
		return {
			status: 204,
			data: {}
		};
	}
}

export default deleteDeploymentHandler;