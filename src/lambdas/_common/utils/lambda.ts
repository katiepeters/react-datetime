import { ArrayCandle, BotConfiguration, BotExecutorResult, Orders, Portfolio } from "../../lambda.types";

const AWS = require('aws-sdk');

interface LambaInvokeOptions {
	FunctionName: string
	InvocationType: string,
	Payload: any
};

interface SupplierdoPayload {
	accountId: string
	deploymentId: string
}

type BotCandles = {
	[symbol: string]: ArrayCandle[]
}

type BotState = {
	[attribute: string]: any
}


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
	},
	invokeSupplierdo( payload: SupplierdoPayload ): Promise<any> {
		return this.invoke({
			FunctionName: 'awstrader-dev-supplierdo',
			InvocationType: 'Event',
			Payload: payload
		});
	},
	invokeExecutor( payload ): Promise<BotExecutorResult> {
		return this.invoke({
			FunctionName: 'awstrader-dev-executor',
			InvocationType: 'RequestResponse',
			Payload: payload
		});
	}
}

export default lambdaUtil;