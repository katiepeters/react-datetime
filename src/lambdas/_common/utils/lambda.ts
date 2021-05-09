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
}
else {
	console.log('WE ARE IN AWS', process.env.region);
}

const lambda = new AWS.Lambda(lambdaOptions);
const lambdaUtil = {
	invoke: function( params: LambaInvokeOptions) : Promise<any> {
		return new Promise( (resolve, reject) => {
			let payload = {
				...params,
				Payload: JSON.stringify(params.Payload)
			};
			
			console.log(`invoke ${payload.FunctionName}`);
			lambda.invoke(payload, (err, response) => {
				if (err) {
					console.log(`err0r ${payload.FunctionName}`);
					console.error(err);
					reject(err);
				}

				console.log(`invoked ${payload.FunctionName}`);

				if (response && response.Payload) {
					return resolve(JSON.parse(response.Payload.toString()))
				}

				resolve(response);
			});
			console.log('invoke called');
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
	},
	invokeSchedulator(): Promise<any> {
		return this.invoke({
			FunctionName: 'awstrader-dev-schedulator',
			InvocationType: 'Event',
			Payload: {}
		})
	}
}

export default lambdaUtil;