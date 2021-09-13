import { getActivatedDeployment, getDeactivatedDeployment, isActiveDeployment } from "../../_common/utils/deploymentUtils";
import { ContextResult, Mutation, MutationContextInput, MutationGetterInput, MutationHandler, MutationResponseInput, ResponseResult } from "../apitron.types";
import { validateShape } from "../utils/validators";


const updateDeploymentHandler: MutationHandler = {
	name: 'updateDeployment',
	async getContext({body, params, models}: MutationContextInput<any>): Promise<ContextResult> {
		// Validate input
		let {error} = validateShape(body, {
			active: 'boolean?',
			version: 'string?',
			name: 'string?'
		});

		if( error ) return {error: {...error, code: 'invalid_payload'}};

		if( body.active === 'undefined' && (!body.name || !body.name.trim()) && !body.version ){
			return {error: {code: 'invalid_payload', reason: 'nothing to update'}};
		} 

		const deployment = await models.deployment.getSingleModel(params.deploymentId);
		if( !deployment ){
			return {error: {code: 'not_found', reason: 'deployment not found', status: 404}};
		}

		if( body.version ){
			const version = await models.botVersion.getSingle(deployment.botId, body.version );
			if( !version ){
				return {error: {code: 'unknown_version'}};
			}
		}

		return {context: {deployment}};
	},

	getMutations(input: MutationGetterInput): Mutation[] {
		const {deployment} = input.context;
		const {active, name, version} = input.body;

		let mutation;
		if( active !== undefined && isActiveDeployment(deployment) !== active ){
			const updatedDeployment = active ?
				getActivatedDeployment( deployment ) :
				getDeactivatedDeployment( deployment )
			;	
			mutation = {
				model: 'deployment',
				action: 'replace', // We completely replace the old object by the new one
				data: updatedDeployment
			};
		}

		if( name || version ){
			if( !mutation ){
				mutation = {
					model: 'deployment',
					action: 'update',
					data: {}
				}
			}
			
			if( name ) mutation.data.name = name.trim();
			if( version ) mutation.data.version = version;
		}
		
		return [mutation];
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