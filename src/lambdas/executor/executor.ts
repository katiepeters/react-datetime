import Trader from "./Trader";

interface RunnerConfig {
	bot: TradeBot
	botId: string
	candles: BotCandles
	config: BotConfiguration
}

export async function executor(event: RunnerConfig) {
	console.log('Executor called', event);

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