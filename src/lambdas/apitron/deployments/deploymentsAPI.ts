import { validate } from "uuid";
import symbols from '../../_common/utils/symbols';

const deploymentAPI = {
	initialize( app: any, models: any ){
		app.get('/deployments', function( req, res ) {
			return getDeploymentList( req, res, models );
		});

		app.post('/deployments', function( req, res) {
			return createDeployment( req, res, models );
		});


	}
}

export default deploymentAPI;


async function getDeploymentList(req, res, models) {
	const { accountId } = req.query;

	if( !accountId ){
		return res
			.status(400)
			.json({error: 'invalid_payload', message: 'deploymentId not provided'})
		;
	}

	let deployments = await models.deployment.getAccountDeployments(accountId);
	return res.json( deployments );
}

async function createDeployment(req, res, models ){
	const { accountId, botId, config } = req.body;

	if( !validateString(accountId) ){
		return requestError(res, 'invalid_payload', 'accountId not valid');
	}

	if (!validateString(botId)) {
		return requestError(res, 'invalid_payload', 'botId not valid');
	}

	if( !config ){
		return requestError(res, 'invalid_payload', 'config not provided');
	}

	const { exchangeAccountId, interval, symbols } = config;
	if( !validateString(exchangeAccountId) ){
		return requestError( res, 'invalid_payload', 'config.exchangeAccountId not valid');
	}
	
	if( !validateSymbols(symbols) ){
		return requestError( res, 'invalid_payload', 'config.symbols not valid');
	}

	if( !validateInterval(interval) ){
		return requestError( res, 'invalid_payload', 'config.interval not valid');
	}
	

}

function requestError(res, error, message){
	return res
		.status(400)
		.json({ error, message })
	;
}


function validateString( str ){
	return str && typeof str === 'string';
}


function validateSymbols( symb ){
	if( !Array.isArray(symb) || !symb.length || !validateSymbol(symb[0]) ) return false;


	const quotedAsset = symbols.getQuoted( symb[0] );
	if( !quotedAsset ) return false;
	
	for( let symbol in symb ){
		if (!validateSymbol(symbol) || symbols.getQuoted(symbol) !== quotedAsset){
			return false;
		}
	}

	return true;
}

function validateSymbol( symbol ){
	return typeof symbol === 'string' && symbol.split('/').length === 2;
}

function validateInterval( interval ){
	// Add other intervals when deciding what are they going to be
	return interval === '1h';
}