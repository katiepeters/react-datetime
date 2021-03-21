const AWS = require('aws-sdk');

interface LambaInvokeOptions {
	FunctionName: string
	InvocationType: string,
	Payload: any
};

let lambdaOptions: any = { region: process.env.region };
if (process.env.IS_OFFLINE ) {
	console.log('LOCAL ENVIRONMENT');
	lambdaOptions = { endpoint: 'http://localhost:3032' };
};

const lambda = new AWS.Lambda(lambdaOptions);
const lambdaUtil = {
	invoke: function( params: LambaInvokeOptions) : Promise<any> {
		return new Promise( (resolve, reject) => {
			let payload = {
				...params,
				Payload: JSON.stringify(params.Payload)
			};

			console.log('invoking lambda', payload)
			lambda.invoke(payload, (err, response) => {
				if (err) {
					console.error(err);
					reject(err);
				}

				if (response && response.Payload) {
					return resolve(JSON.parse(response.Payload.toString()))
				}

				resolve(response);
			})
		});
	}
}

export default lambdaUtil;