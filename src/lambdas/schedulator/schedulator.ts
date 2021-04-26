import BotDeploymentModel from "../_common/dynamo/BotDeploymentModel";
import lambdaUtil from "../_common/utils/lambda";

export async function schedulator(event) {
	console.log('Schedulator called');

	let deployments = await BotDeploymentModel.getActiveDeployments('1h');
	console.log(deployments);

	deployments.forEach( ({accountId, resourceId}) => {
		lambdaUtil.invokeSupplierdo({
			accountId,
			deploymentId: resourceId.split('#')[1]
		});
	});


	return {
		statusCode: 200,
		body: JSON.stringify(
			{
				message: 'Go Serverless v1.0! Your function executed successfully!',
				input: event,
			},
			null,
			2
		),
	};
}