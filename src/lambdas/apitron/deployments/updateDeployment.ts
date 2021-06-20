import { getActivatedDeployment, getDeactivatedDeployment, isActiveDeployment } from "../../_common/utils/deploymentUtils";
import { ContextResult, Mutation, MutationContextInput, MutationGetterInput, MutationHandler, MutationResponseInput, ResponseResult } from "../apitron.types";
import { validateShape } from "../utils/validators";


const updateDeploymentHandler: MutationHandler = {
	name: 'updateDeployment',
	async getContext({body, params, models}: MutationContextInput<any>): Promise<ContextResult> {
		// Validate input
		let {error} = validateShape(body, {
			accountId: 'string',
			active: 'boolean?',
			name: 'string?'
		});
		if( error ) return {error: {...error, code: 'invalid_payload'}};

		if( body.active === 'undefined' && (!body.name || !body.name.trim()) ){
			return {error: {code: 'invalid_payload', reason: 'nothing to update'}};
		} 

		const deployment = await models.deployment.getSingleSimple(body.accountId, params.deploymentId);
		if( !deployment ){
			return {error: {code: 'not_found', reason: 'deployment not found', status: 404}};
		}

		return {context: {deployment}};
	},

	getMutations(input: MutationGetterInput): Mutation[] {
		const {deployment} = input.context;
		const {active} = input.body;

		if( isActiveDeployment(deployment) === active ){
			return [];
		}

		const updatedDeployment = active ?
			getActivatedDeployment( deployment ) :
			getDeactivatedDeployment( deployment )
		;
		
		return [{
			model: 'deployment',
			action: 'create', // We completely replace the old object by the new one
			data: updatedDeployment
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