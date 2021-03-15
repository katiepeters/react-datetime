import exchanger from "../trader/exchanger";


interface BotState {
	[key:string]: any
}

interface RunnerConfig {
	bot: TradeBot
	botId: string
	candles: BotCandles
	config: BotConfiguration
}

export default async function runner(accountId: string, deploymentId: string) {
	// Get bot and bot data
	let bot = botStore.getBot(id);
	let {config, state, data} = await botStore.getRunData(id);
	let credentials = await credentialsStore.getCredentials(data.accountId, config.exchange);

	// Get market data and portfolio data
	let {candles, orders, portfolio} = await exchanger.getRunData(config.exchange, config.symbols, credentials);
	data = botStore.updateData( data, orders, portfolio );

	// Run the bot
	let trader = new Trader(data, portfolio);
	await bot.onData({config, state, trader, candles});
	let orderUpdates = trader.getOrderUpdates();

	// Update orders
	let orderUpdatesResult = await exchanger.setOrderUpdates( orderUpdates );

	// Update bot data
	let updatedOrders = botStore.getUpdatedOrders( data, orderUpdatesResult );
	botStore.updateRunData( data, state, updatedOrders );
}