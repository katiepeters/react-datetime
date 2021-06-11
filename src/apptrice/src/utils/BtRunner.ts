import { BacktestConfig } from "../screens/botEditor/tools/BotTools";
import store from "../state/store"
import {v4 as uuid} from 'uuid';
import { DbBot } from "../../../lambdas/model.types";
import BtBotRunner from "./BtBotRunner";
import { runBotIteration } from "../../../lambdas/_common/botRunner/runBotIteration";

let runner: BtBotRunner;
const BtRunner = {
	start( bot: DbBot, options: BacktestConfig ): string {
		const btid = createRun( bot.id );

		prepareAndRun( bot, options );

		return btid;
	},

	abort(){
		if (store.currentBackTesting.status === 'running') {
			updateBtStore({ status: 'aborted' });
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

	updateBtStore({ status: 'candles'});
	await runner.getAllCandles();

	updateBtStore({ status: 'running' });
	await runIterations( bot, runner );

	updateBtStore({ status: 'completed' });
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

function updateBtStore( update: any ){
	store.currentBackTesting = {
		...store.currentBackTesting,
		...update
	};
}

async function runIterations( bot: DbBot, runner: BtBotRunner ) {
	const { accountId, id: botId } = bot;

	while( runner.hasIterationsLeft() ){
		console.log(`Iteration ${runner.iteration}`);
		await runBotIteration( accountId, botId, runner );
		runner.iteration++;
	}
}