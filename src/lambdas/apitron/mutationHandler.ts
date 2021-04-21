import { MutationHandler } from "./apitron.types";

interfa

const handleRequest = function( req, res ) {

}

const mutationRequestHandler = function (req: Express.Request, res: Express.Response, handler: MutationHandler ){
	let contextResult = handler.getRequestContext( req.body, req.params );

	if( contextResult.error ){
		return res
			.status( contextResult.errorStatus || 400 )
			.json({
				error: error.errorCode || 'invalid_payload',
				errorMessage:
			})
	}

	let mutationsResult = handler.getMutations( req.body, contextResult.context, )


}