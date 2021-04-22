import { DynamoModels } from "../_common/dynamo/allModels";

export interface HandlerError {
	code: string,
	status?: number,
	reason?: string
}

export interface HanlderResult {
	error?: HandlerError,
	status?: number,
	data?: any
}

export interface ErrorResult {
	error: HandlerError
}

export interface ContextResult {
	context?: any,
	error?: HandlerError
}

export interface MutationContextInput {
	body: any,
	params: any,
	models: DynamoModels
}

export interface MutationGetterInput {
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
	mutations: Mutation[],
	mutationResults: any[]
}

export interface ResponseResult {
	status?: number,
	data: any
}

export interface MutationHandler {
	getContext( input: MutationContextInput ): Promise<ContextResult>,
	getMutations( input: MutationGetterInput ): Mutation[],
	getResponse( input: MutationResponseInput ): ResponseResult
	name?: string
}

export interface ContextHandlerInput {
	params: any
	models: DynamoModels
}

export interface ContextResponseInput {
	params: any
	context: any
}

export interface QueryHandler {
	getContext(input: ContextHandlerInput): Promise<ContextResult>
	getResponse(input: ContextResponseInput): ResponseResult
	name?: string
}
