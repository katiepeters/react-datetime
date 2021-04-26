import symbols from "../../_common/utils/symbols";

interface ShapeValidationError {
	code: string
	field?: string
	message: string
}

interface ShapeValidatorResult {
	error?: ShapeValidationError
}

export function validateShape(obj: any, shape: any): ShapeValidatorResult{
	for( const key in shape ){
		const {error} = validateElement( obj[key], shape[key] );
		if( error ){
			return {
				error: {
					...error,
					field: error.field ? `${key}.${error.field}` : key
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
		return { error: { code: 'invalid_value', message: '{field} is not valid' } };
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
	symbols: value => validateSymbols(value),
	boolean: value => typeof value === 'boolean',
	provider: value => value === 'bitfinex',
	providerType: value => value === 'real' || value === 'virtual'
}

function validateSymbols( symb ){
	if( !Array.isArray(symb) || !symb.length || !validateSymbol(symb[0]) ) return false;

	const quotedAsset = symbols.getQuoted( symb[0] );
	if( !quotedAsset ) return false;
	
	for( let i in symb ){
		const symbol = symb[i];
		if (!validateSymbol(symbol) || symbols.getQuoted(symbol) !== quotedAsset) {
			return false;
		}
	}

	return true;
}

function validateSymbol( symbol ){
	return typeof symbol === 'string' && symbol.split('/').length === 2;
}
