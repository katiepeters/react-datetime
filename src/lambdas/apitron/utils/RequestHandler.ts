import allModels from "../../_common/dynamo/allModels";
import { Mutation, MutationHandler, QueryHandler } from "../apitron.types";

export async function mutationHandler(req, res, handler: MutationHandler){
	return await safeHandler( req, res, mutationController, handler);
}

export async function queryHandler(req, res, handler: QueryHandler ){
	return await safeHandler( req, res, queryController, handler);
}

async function safeHandler(req, res, controller, handler ){
	let response:any = {};
 
	try {
		response = await controller(req, handler);
	}
	catch (error) {
		console.error(`Unexpected error in ${handler.name || 'mutationHandler'}`, error);
		response = {
			error: {code: 'unexpected_error', status: 500}
		};
	}

	if (response.error) {
		return res
			.status(response.error.status || 400)
			.json({
				error: response.error.code,
				reason: response.error.reason
			})
		;
	}

	return res
		.status( response.status || 200 )
		.json( response.data || {} )
	;
}

async function mutationController( req, handler: MutationHandler){
	const {context = {}, error} = await handler.getContext({
		body: req.body,
		params: req.params,
		models: allModels
	});

	if( error ){
		return error;
	}

	const mutations = handler.getMutations({
		body: req.body,
		params: req.params,
		context
	});

	const mutationResults = await applyMutations( mutations );

	return {
		data: handler.getResponse({
			body: req.body,
			params: req.params,
			context,
			mutations,
			mutationResults
		})
	};
}

async function queryController( req, handler: QueryHandler ){
	const { context = {}, error } = await handler.getContext({
		params: req.query,
		models: allModels
	});

	if (error) {
		return error;
	}

	return {
		data: handler.getResponse({
			params: req.query,
			context
		})
	};
}

async function applyMutations( mutations: Mutation[] ): Promise<any[]>{
	const promises = mutations.map( (m:Mutation) => (
		allModels[m.model][m.action](m.data)
	));

	return await Promise.all(promises);
}