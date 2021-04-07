/* eslint-disable no-restricted-globals */
// @global self

import * as ts from "typescript";
import { BotCandles, BotExecutorResult, BotState, Portfolio } from "../../../../../lambdas/lambda.types";
import { ExchangeOrder } from "../../../../../lambdas/_common/exchanges/ExchangeAdapter";

interface BotWorkerInput {
	portfolio: Portfolio,
	orders: { [id: string]: ExchangeOrder },
	state: BotState,
	candles: BotCandles
}

export function createBot( botSource:string ) {
	let code = `class Bot ${botSource.split(/extends\s+TradeBot/)[1]};`;
	let jsCode;
	try {
		jsCode = ts.transpile(code);
	}
	catch (err) {
		console.error('Bot code not valid: ', err);
	}
	if( !jsCode ){
		return;
	}

	const fnSrc = jsCode + '\n';
	const wSrc = 'var w = ' + wrapper.toString() + ';\n' + 'w();';
	const worker = SrcWorker(fnSrc + wSrc);

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

var wrapper = function () {
	// Bot already defined
	// @ts-ignore
	let bot = new Bot();

	self.onmessage = function (msg: any) {
		debugger;

		let result = bot.onData(msg.data);
		// @ts-ignore
		self.postMessage( result );
	};
}