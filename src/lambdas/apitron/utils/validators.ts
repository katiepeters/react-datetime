import { Balance, Portfolio } from "../../lambda.types";
import arrayize from "../../_common/utils/arrayize";
import pairUtils from "../../_common/utils/pairs";

interface ShapeValidationError {
	code: string
	field?: string
	reason: string
}

interface ShapeValidatorResult {
	error?: ShapeValidationError
}

export function validateShape(obj: any, shape: any): ShapeValidatorResult{
	for( const key in shape ){
		const {error} = validateElement( obj[key], shape[key] );
		if( error ){
			console.log(error);
			const field = error.field ? `${key}.${error.field}` : key;
			return {
				error: {
					code: error.code,
					reason: error.reason.replace('{field}', `'${field}'`)
				}
			}
		}
	}
	return {};
}

function validateElement(value: any, type: any): ShapeValidatorResult{
	if (typeof type === 'string') {
		return validateFinalType(value, type);
	}

	if (Array.isArray(type)) {
		return validateArray(value, value[0]);
	}

	// Object
	return validateShape(value, type);
}

function validateArray(arr: any[], type: string): ShapeValidatorResult {
	for( let i = 0; i<arr.length; i++ ){
		let {error} = validateElement(arr[i], type);
		if( error ){
			return {
				error: {
					...error,
					field: error.field ? `${i}.${error.field}` : i.toString()
				}
			}
		}
	}
	return {};
}

function validateFinalType( value: any, type: string ){
	if( type.endsWith('?') ){
		if( value === undefined ) return {};
		type = type.slice(0, type.length - 1);
	}

	if (!isValid(value, type)) {
		return { error: { code: 'invalid_value', reason: '{field} is not valid' } };
	}
	return {};
}


export function isValid( value: any, type: string ){
	return validators[type](value);
}

const validIntervals = {
	'1h': true
}

const validators = {
	string: value => typeof value === 'string',
	runInterval: value => validIntervals[value] === true,
	pairs: validatePairs,
	boolean: value => typeof value === 'boolean',
	provider: value => value === 'bitfinex',
	providerType: value => value === 'real' || value === 'virtual',
	portfolio: validatePortfolio,
	pricesType: oneOf(['hourly', 'daily', 'weekly', 'monthly']),
	botVersionType: oneOf(['minor', 'major']),
	botVersion: validateBotVersion,
	lockedVersion: value => value === true,
	versionLabel: value => typeof value === 'string' && value.length <= 20
}

function validatePairs( pairs ){
	if( !Array.isArray(pairs) || !pairs.length || !validatePair(pairs[0]) ) return false;

	const quotedAsset = pairUtils.getQuoted( pairs[0] );
	if( !quotedAsset ) return false;
	
	for( let i in pairs ){
		const pair = pairs[i];
		if (!validatePair(pair) || pairUtils.getQuoted(pair) !== quotedAsset) {
			return false;
		}
	}

	return true;
}

function validatePair( pair ){
	return typeof pair === 'string' && pair.split('/').length === 2;
}

function validatePortfolio( portfolio: Portfolio ){
	if( !portfolio ) return false;
	return !arrayize(portfolio)
		.find( (balance:Balance) => !validateBalance(balance) )
	;
}

function validateBalance( balance: Balance ){
	if( !balance ) return false;
	if( !balance.asset || typeof balance.asset === 'string' ) return false;
	if (balance.free === undefined || typeof balance.free !== 'number' || balance.free < 0) return false;
	if (balance.total === undefined || typeof balance.total !== 'number' || balance.total < 0) return false;
	if( balance.free > balance.total ) return false;
	return true;
}

function validateBotVersion( version: string ){
	if( !version || typeof version !== 'string' ) return false;

	let parts = version.split('.');
	if( parts.length !== 2 ) return;

	return (
		parseInt(parts[0], 10).toString() === parts[0] &&
		parseInt(parts[1], 10 ).toString() === parts[1]
	);
}

function oneOf( elements: any[] ){
	return function( value: any ){
		return elements.includes(value);
	}
}