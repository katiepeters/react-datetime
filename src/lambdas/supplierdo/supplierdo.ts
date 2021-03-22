import BotDeploymentModel from '../_common/dynamo/BotDeploymentModel';
import BotModel from '../_common/dynamo/BotModel';
import dataFetcher from '../_common/exchangeDataFetcher/exchangeDataFetcher';
import lambdaUtil, {BotExecutorPayload} from '../_common/utils/lambda';

export async function supplierdo({ accountId, deploymentId }) {
	const deployment = await BotDeploymentModel.getSingle(accountId, deploymentId);
	if( !deployment ){
		console.warn(`Supplierdo called on an unknonw deploymentId`, accountId, deploymentId);
		return { statusCode: 404 };
	}

	const bot = await BotModel.getSingle(accountId, deployment.botId);
	const exchangeData = await dataFetcher.getData({
		exchange: deployment.config.exchangeType,
		market: deployment.config.symbols[0],
		interval: deployment.config.interval
	});

	if( !bot ) {
		return {statusCode: 404};
	}
	
	const botInput: BotExecutorPayload = {
		code: bot?.code,
		candles: {
			[deployment.config.symbols[0]]: exchangeData
		},
		config: {
			symbols: deployment.config.symbols,
			interval: deployment.config.interval,
			exchange: 'bitfinex'
		},
		state: deployment.state
	}

	lambdaUtil.invokeExecutor(botInput)
		.then( result =>{
			console.log('Result from the executor', result);
		})
	;

	return {
		statusCode: 200,
		body: JSON.stringify(
			{
				message: 'Go Serverless v1.0! Your function executed successfully!',
				input: {accountId, deploymentId},
			},
			null,
			2
		),
	};
}