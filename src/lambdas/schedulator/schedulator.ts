import BotDeploymentModel from "../_common/dynamo/BotDeploymentModel";
import lambdaUtil from "../_common/utils/lambda";

export async function schedulator(event) {
	console.log('Schedulator called');

	let deployments = await BotDeploymentModel.getActiveDeployments('1h');
	console.log(deployments);

	let promises: any[] = [];
	deployments.forEach( ({accountId, resourceId}) => {
		console.log(`invoking supplierdo ${resourceId}`);
		let payload = {
			accountId,
			deploymentId: resourceId.split('#')[1]
		};

		promises.push( lambdaUtil.invokeSupplierdo(payload)
			.then( res => console.log('Supplierdo invoked', res) )
			.catch( err => console.log('Supplierdo error', err) )
		);
	});

	return Promise.all( promises )
		.then((results: any) => {
			console.log('promises results', results);
			return {
				statusCode: 200,
				body: JSON.stringify(
					{
						message: 'Schedulator run ok'
					},
					null,
					2
				),
			};
		})
		.catch( err => {
			return {
				statusCode: 500,
				body: JSON.stringify({error: err})
			};
		})
	;
}