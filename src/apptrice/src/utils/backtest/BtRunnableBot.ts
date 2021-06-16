import { BotRunInput, RunnableBot } from "../../../../lambdas/_common/botRunner/BotRunner";
import { BotWorker, createBot } from "./worker/botWorker";

export interface IBtRunnableBot extends RunnableBot {
	source: string
	currentDate: number
	bot?: BotWorker
	terminate(): void
}

const BtRunnableBot: IBtRunnableBot = {
	source: 'null',
	currentDate: Date.now(),

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

	async run( input: BotRunInput ){
		if( !this.bot ){
			throw new Error('Running a bot not initialized');
		}

		return {
			currentDate: this.currentDate,
			...( await this.bot.execute(input) )
		};
	},

	terminate(){
		if( this.bot ){
			this.bot.terminate();
			delete this.bot;
		}
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