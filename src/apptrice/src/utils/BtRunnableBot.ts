import { BotRunInput, RunnableBot } from "../../../lambdas/_common/botRunner/BotRunner";
import { BotWorker, createBot } from "../screens/botEditor/backtesting/botWorker";

interface IBtRunnableBot extends RunnableBot {
	source: string
	bot?: BotWorker
}

const BtRunnableBot: IBtRunnableBot = {
	source: 'null',

	async prepare( source: string ){
		const botWorkerSource = await getWorkerSource();
		if( !botWorkerSource ){
			throw new Error('cant_fetch_worker_source');
		}

		let bot = createBot( source, botWorkerSource );
		if( !bot ){
			throw new Error('worker_bot_error');
		}

		this.bot = bot;
	},

	run( input: BotRunInput ){
		if( !this.bot ){
			throw new Error('Running a bot not initialized');
		}

		return this.bot.execute( input );
	}
}

export {BtRunnableBot};


let workerSource: string;
function getWorkerSource(): Promise<string> {
	if (workerSource) {
		return Promise.resolve(workerSource);
	}

	return fetch('/wwph.js')
		.then(res => res.text())
		.then(source => {
			workerSource = source;
			return source;
		})
	;
}