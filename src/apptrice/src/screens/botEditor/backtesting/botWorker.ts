/* eslint-disable no-restricted-globals */
// @global self

import * as ts from "typescript";
import { BotCandles, BotConfigurationExtra, BotExecutorResult, BotState, Portfolio } from "../../../../../lambdas/lambda.types";
import { ExchangeOrder } from "../../../../../lambdas/_common/exchanges/ExchangeAdapter";

interface BotWorkerInput {
	portfolio: Portfolio,
	orders: { [id: string]: ExchangeOrder },
	state: BotState,
	candles: BotCandles,
	config: BotConfigurationExtra
}

export interface BotWorker {
	execute: (options: BotWorkerInput) => Promise<BotExecutorResult>,
	terminate: () => void
}

export function createBot( botSource:string, botWorkerSource: string ): BotWorker|null {
	let jsCode = transpileBot( botSource );
	if( !jsCode ) return null;

	// Set the bot in the worker
	const workerSource = botWorkerSource
		.replace('console.log("#BOT"),', jsCode) // production
		.replace('console.log("#BOT");', jsCode) // development
	;
	const worker = SrcWorker(workerSource);

	return {
		execute: async function (options: BotWorkerInput): Promise<BotExecutorResult>{
			return new Promise( (resolve, reject) => {
				worker.onmessage = function (result) {
					worker.onmessage = null;
					worker.onerror = null;
					resolve(result.data);
				};
				worker.onerror = function (err) {
					worker.onmessage = null;
					worker.onerror = null;
					reject(err);
				}

				worker.postMessage( options );
			})
		},
		terminate: function(){
			worker.terminate();
		}
	};
}

function SrcWorker(src: string) {
	let blob = new window.Blob([src], { type: "text/javascript" });
	return new window.Worker(
		window.URL.createObjectURL( blob ),
		{name: 'Bot'}
	);
}

function transpileBot( source: string ){
	let compilerOptions = {
		lib: ["es2016"]
	};
	let code = `class Bot ${source.split(/extends\s+TradeBot/)[1]};`;

	let transpiled;
	try {
		transpiled = ts.transpile(code, compilerOptions);
	}
	catch (err) {
		console.error('Bot code not valid: ', err);
	}

	if( transpiled ){
		return `${transpiled};let bot = new Bot();`;
	}
}