import { ConsoleEntry, DBBotDeployment, DbExchangeAccount, DeploymentOrders, Order } from "../../model.types";
import BotDeploymentModel from "../dynamo/BotDeploymentModel"
import BotModel from "../dynamo/BotModel";
import ExchangeAccountModel from "../dynamo/ExchangeAccountModel";
import VirtualAdapter from "../exchanges/adapters/VirtualAdapter";
import { ExchangeAdapter, ExchangeOrder } from "../exchanges/ExchangeAdapter";
import exchanger from "../exchanges/exchanger";
import exchangeUtils from "../exchanges/exchangeUtils";
import { BotRunner, BotRunnerDeploymentUpdate, BotRunnerExchangeUpdate, CodeError, RunnableBot } from "./BotRunner";
import { SupplierdoRunnableBot } from "./SupplierdoRunnableBot";

const SupplierdoRunner: BotRunner = {
	async getDeployment( accountId: string, deploymentId: string ){
		const deployment = await BotDeploymentModel.getSingle( accountId, deploymentId );
		if( !deployment ){
			throw new Error('unknown_deployment');
		}
		return deployment;
	},

	async getExchangeAccount( accountId: string, exchangeAccountId: string ){
		const exchange = await ExchangeAccountModel.getSingle( accountId, exchangeAccountId );
		if( !exchange ){
			throw new Error('unknown_exchange_account');
		}
		return exchange;
	},

 	getExchangeOrders( adapter: ExchangeAdapter ){
		if( adapter instanceof VirtualAdapter ){
			return adapter.orders;
		}
	},

	async getAdapter( exchangeAccount: DbExchangeAccount ): Promise<ExchangeAdapter> {
		console.log('Get adapter', exchangeAccount);
		const exchangeAdapter = exchanger.getAdapter( exchangeAccount );

		if (!exchangeAdapter) {
			throw new Error(`Unknown adapter ${exchangeAccount.provider}`);
		}

		if( exchangeAdapter instanceof VirtualAdapter ){
			console.log('Hidratandoooo!!');
			await exchangeAdapter.hydrate();
		}

		return exchangeAdapter;
	},

	getCandles( adapter: ExchangeAdapter, deployment: DBBotDeployment ){
		let promises = deployment.symbols.map( (symbol:string) => adapter.getCandles({
			market: symbol,
			runInterval: deployment.runInterval,
			lastCandleAt: exchangeUtils.getLastCandleAt(deployment.runInterval, Date.now()),
			candleCount: 200
		}));

		return Promise.all( promises ).then( results => {
			let candles = {};
			deployment.symbols.forEach( (symbol,i) => {
				candles[symbol] = results[i]
			});
			return candles;
		});
	},

	async getBot( accountId: string, botId: string ): Promise<RunnableBot>{
		let dbBot = await BotModel.getSingle( accountId, botId );

		if( !dbBot ){
			throw new CodeError({
				code: 'unknown_bot',
				extra:{accountId, botId}
			});
		}

		let bot = new SupplierdoRunnableBot();
		bot.prepare( dbBot.code );
		return bot;
	},

	async updateDeployment( deployment: DBBotDeployment, update: BotRunnerDeploymentUpdate ) {
		let payload = {
			accountId: deployment.accountId,
			deploymentId: deployment.id,
			update
		};

		console.log( 'Updating deployment' );
		await BotDeploymentModel.update( payload );

		return {
			...deployment,
			...update
		}
	},

	async updateExchange( exchange: DbExchangeAccount, update: BotRunnerExchangeUpdate ) {
		let promises = [
			ExchangeAccountModel.updatePortfolio(exchange.accountId, exchange.id, update.portfolio )
		];

		if( update.orders ){
			console.log('We are updating exchange orders');
			promises.push(
				ExchangeAccountModel.updateOrders(exchange.accountId, exchange.id, update.orders )
			);
		}

		return Promise.all(promises).then( () => {
			return {
				...exchange,
				portfolioHistory: [
					...(exchange.portfolioHistory || []),
					{
						date: Date.now(),
						balances: update.portfolio || {}
					}
				]
			}
		});
	},

	async setRunError( deployment: DBBotDeployment, error: any ){
		// When the bot finishes in an error we probably want to log the error
		// for the user and then deactivate the deployment
		console.log('The execution ended in an error', error);
		await BotDeploymentModel.deactivate({
			accountId: deployment.accountId,
			deploymentId: deployment.id
		});
		// this is just for testing
		// await BotDeploymentModel.activate({ accountId, deploymentId });
		let logs: ConsoleEntry[] = [
			...deployment.logs,
			{
				id: -1,
				date: Date.now(),
				type: 'error',
				message: String(error)
			}
		];

		await BotDeploymentModel.update({
			accountId: deployment.accountId,
			deploymentId: deployment.id,
			update: {logs}
		});
	},

	cancelOrders( adapter: ExchangeAdapter, deploymentOrders: DeploymentOrders, orderIds: string[] ){
		let exchangeOrderIds: string[] = [];
		let deploymentOrderIds: string[] = [];
		orderIds.forEach( (id: string) => {
			let order = deploymentOrders.items[id];
			if( order && order.foreignId ){
				exchangeOrderIds.push( order.foreignId );
				deploymentOrderIds.push( order.id );
			}
		});

		return adapter.cancelOrders( exchangeOrderIds ).then( () => {
			return deploymentOrderIds;
		});
	},

	placeOrders( adapter: ExchangeAdapter, orders: Order[]): Promise<ExchangeOrder[]>{
		return adapter.placeOrders(orders);
	}
}

export {SupplierdoRunner};