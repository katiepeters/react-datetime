import { DynamoModels } from "../_common/dynamo/allModels";

export interface HandlerError {
	code: string,
	status?: number,
	reason?: string
}

export interface ErrorResult {
	error: HandlerError
}

export interface ContextResult {
	context?: any,
	error?: HandlerError
}

export interface ContextHandlerInput {
	body: any,
	params: any,
	models: DynamoModels
}

export interface MutationHandlerInput {
	body: any,
	params: any,
	context: any
}

export interface Mutation {
	model: string,
	action: string,
	data: any
}

export interface MutationResponseInput {
	body: any
	params: any
	context: any,
	mutations: Mutation[]
}

export interface ResponseResult {
	status?: number,
	data: any
}

export interface MutationHandler {
	getRequestContext( input: ContextHandlerInput ): Promise<ContextResult>,
	getMutations( input: MutationHandlerInput ): Mutation[],
	getResponse( input: MutationResponseInput ): ResponseResult
}
