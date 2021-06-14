import { BacktestConfig } from "../screens/botEditor/tools/BotTools";
import store from "../state/store"
import {v4 as uuid} from 'uuid';
import { DbBot, DBBotDeployment, ExchangeAccountWithHistory } from "../../../lambdas/model.types";
import BtBotRunner from "./BtBotRunner";
import { runBotIteration } from "../../../lambdas/_common/botRunner/runBotIteration";
import quickStore from "../state/quickStore";
import { BtUpdater } from "./BtUpdater";
import { BtDeployment, BtExchange } from "./Bt.types";
import { Portfolio } from "../../../lambdas/lambda.types";

let runner: BtBotRunner;
const BtRunner = {
	start( bot: DbBot, options: BacktestConfig ): string {
		const btid = createRun( bot.id );

		prepareAndRun( bot, options );

		return btid;
	},

	abort(){
		const activeBt = quickStore.getActiveBt();
		if ( activeBt && activeBt.status === 'running') {
			BtUpdater.update({status: 'aborted'});
			if( runner ){
				runner?.bot?.terminate();
			}
		}
	}
}

export default BtRunner;


async function prepareAndRun(bot: DbBot, options: BacktestConfig){
	runner = new BtBotRunner({
		accountId: bot.accountId,
		botId: bot.id,
		baseAssets: options.baseAssets,
		quotedAsset: options.quotedAsset,
		runInterval: options.runInterval,
		startDate: options.startDate,
		endDate: options.endDate,
		balances: options.initialBalances,
		fees: options.fees,
		slippage: options.slippage,
		exchange: 'bitfinex'
	});

	BtUpdater.update({
		status: 'candles'
	});
	await runner.getAllCandles();

	BtUpdater.update({
		status: 'running',
		currentIteration: 0,
		candles: runner.candles,
		totalIterations: runner.totalIterations,
		deployment: toBtDeployment( runner.deployment ),
		exchange: toBtExchange( runner.exchange )
	});
	await runIterations( bot, runner );

	BtUpdater.update({ status: 'completed' });
	runner.bot?.terminate();
}

function createRun( botId: any ): string{
	let btid = uuid();
	store.currentBackTesting = {
		id: btid,
		botId: botId,
		status: 'init',
		iteration: 0,
		totalIterations: 0,
		orders: {},
		balances: []
	};
	return btid;
}

async function runIterations( bot: DbBot, runner: BtBotRunner ) {
	const { accountId, id: botId } = bot;

	while( runner.hasIterationsLeft() ){
		console.log(`Iteration ${runner.iteration}`);
		await runBotIteration( accountId, botId, runner );
		BtUpdater.update({
			currentIteration: 0,
			deployment: toBtDeployment(runner.deployment),
			exchange: toBtExchange(runner.exchange)
		});
		runner.iteration++;
	}
}

function toBtDeployment( deployment: DBBotDeployment ): BtDeployment{
	return {
		logs: deployment.logs,
		orders: deployment.orders,
		runInterval: deployment.runInterval,
		state: deployment.state,
		symbols: deployment.symbols
	};
}

function toBtExchange( exchange: ExchangeAccountWithHistory ): BtExchange{
	return {
		portfolioHistory: exchange.portfolioHistory,
		provider: exchange.provider,
		fees: exchange.fees,
		slippage: exchange.slippage
	};
}