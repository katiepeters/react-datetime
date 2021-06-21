import { BotVersions, VersionHistory } from "../../model.types";
import { ContextResult, Mutation, MutationContextInput, MutationGetterInput, MutationHandler, MutationResponseInput, ResponseResult } from "../apitron.types";
import { validateShape } from "../utils/validators";

const updateBotVersionHandler: MutationHandler = {
	name: 'updateBotVersion',
	async getContext({body, params, query, models}: MutationContextInput<any>): Promise<ContextResult> {
		const {number} = params;
		const { accountId, botId } = query;
		const { code } = body;

		// Validate input
		const input = {number, accountId, botId, code };
		console.log( number, accountId, botId );
		let {error} = validateShape(input, {
			accountId: 'string',
			botId: 'string',
			number: 'string',
			code: 'string'
		});
		if( error ) return {error: {...error, code: 'invalid_payload'}};

		const bot = await models.bot.getSingle(accountId, botId);
		if( !bot ) return {error: {code: 'not_found', status: 404}};

		if( !isEditableVersion(number, bot.versions) ){
			return {error: {code: 'version_not_editable'}};
		}

		return {context: input};
	},

	getMutations(input: MutationGetterInput): Mutation[] {
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


function isEditableVersion( number: string, versions: BotVersions ) {
	let parts = number.split('.');
	let major: VersionHistory = versions[parts[0]];
	return major && major.lastMinor === parseInt(parts[1]);
}

export default updateBotVersionHandler;