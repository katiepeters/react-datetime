import lambdaUtil from "../_common/utils/lambda";

const exchanges = [
	'bitfinex'
];

export async function tickerer(event) {
	let promises: Promise<any>[] = exchanges.map( exchange => (
		lambdaUtil.invokeTickerUpdater( exchange )
	));

	return Promise.all( promises )
		.then( () => {error: false} )
		.catch( (error:any) => {
			console.error( error );
			return {error: error && error.toString() }
		})
	;
}



