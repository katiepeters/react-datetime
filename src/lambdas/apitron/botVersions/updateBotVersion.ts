import { ContextResult, Mutation, MutationContextInput, MutationGetterInput, MutationHandler, MutationResponseInput, ResponseResult } from "../apitron.types";
import { validateShape } from "../utils/validators";

const updateBotVersionHandler: MutationHandler = {
	name: 'updateBotVersion',
	async getContext({body, params, query, models}: MutationContextInput<any>): Promise<ContextResult> {
		const {number} = params;
		const { botId } = query;
		const { code, isLocked, label } = body;

		// Validate input
		const input = {number, botId, code, isLocked, label };
		console.log( number, botId );

		let {error} = validateShape(input, {
			botId: 'string',
			number: 'string',
			code: 'string?',
			label: 'versionLabel?',
			locked: 'lockedVersion?'
		});

		if( error ) return {error: {...error, code: 'invalid_payload'}};

		const version = await models.botVersion.getSingle(botId, number);
		if( !version ) return {error: {code: 'not_found', status: 404}};

		if( code !== undefined && version.isLocked ){
			return {error: {code: 'version_not_editable'}};
		}

		return {context: input};
	},

	getMutations(input: MutationGetterInput): Mutation[] {
		console.log(input.context);
		return [
			{model: 'botVersion', action: 'update', data: input.context}
		];
	},

	getResponse(input: MutationResponseInput): ResponseResult {
		return {
			status: 200,
			data: {number: input.body.versionNumber}
		};
	}
}

export default updateBotVersionHandler;