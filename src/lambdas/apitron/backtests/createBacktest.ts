import { ContextResult, Mutation, MutationContextInput, MutationGetterInput, MutationHandler, MutationResponseInput, ResponseResult } from "../apitron.types";
import { validateShape } from "../utils/validators";

const createBacktestHandler: MutationHandler = {
	name: 'createBacktest',
	async getContext({body, params, models}: MutationContextInput<any>): Promise<ContextResult> {
		// Validate input
		let {error} = validateShape(body, {
			accountId: 'string',
			botId: 'string',
			versionNumber: 'string',
			data: 'string'
		});
		if( error ) return {error: {...error, code: 'invalid_payload'}};

		const {accountId, botId, versionNumber } = body;
		const version = models.botVersion.getSingle(accountId, botId, versionNumber)

		if( !version ){
			return {error: {code: 'bot_version_not_found'}};
		}

		return {context: {}};
	},

	getMutations(input: MutationGetterInput): Mutation[] {
		const backtest = {
			
		}
		return [];
	},

	getResponse(input: MutationResponseInput): ResponseResult {
		return {
			status: 200,
			data: {}
		};
	}
}

export default createBacktestHandler;