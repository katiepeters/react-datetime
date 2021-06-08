/* eslint-disable no-restricted-globals */
// @global self

import * as ts from "typescript";
import { BotConfiguration, BotExecutorResult, BotState } from "../../../../../lambdas/lambda.types";
import { BotRunInput } from "../../../../../lambdas/_common/botRunner/BotRunner";

export interface BotWorker {
	initialize: (config: BotConfiguration) => Promise<BotState>,
	execute: (options: BotRunInput) => Promise<BotExecutorResult>,
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
		initialize: async function (config: BotConfiguration): Promise<BotState>{
			return new Promise((resolve, reject) => {
				worker.onmessage = function (result) {
					worker.onmessage = null;
					worker.onerror = null;
					resolve(result.data || {});
				};
				worker.onerror = function (err) {
					worker.onmessage = null;
					worker.onerror = null;
					reject(err);
				}
				worker.postMessage({action: 'init', input: config});
			})
		},
		execute: async function (input: BotRunInput): Promise<BotExecutorResult>{
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

				worker.postMessage( {action: 'run', input} );
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
	let transpiled;
	try {
		transpiled = ts.transpile(source, compilerOptions);
	}
	catch (err) {
		console.error('Bot code not valid: ', err);
	}

	return transpiled;
}