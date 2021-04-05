/* eslint-disable no-restricted-globals */
// @global self

import * as ts from "typescript";
import { BotInput } from "../../../../../lambdas/lambda.types";

export function createBot( botSource:string ) {
	let code = `class Bot ${botSource.split(/extends\s+TradeBot/)[1]}; Bot;`;
	let jsCode;
	try {
		jsCode = ts.transpile(code);
	}
	catch (err) {
		console.error('Bot code not valid: ', err);
	}
	if( jsCode ){
		return;
	}

	const fnSrc = 'let Bot = eval(' + jsCode + ');\n';
	const wSrc = 'var w = ' + wrapper.toString() + ';\n' + 'w();';
	const worker = SrcWorker(fnSrc + wSrc);

	return {
		execute: async function( options: BotInput ){
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
	return new window.Worker(window.URL.createObjectURL(
		new window.Blob([src], { type: "text/javascript" })
	));
}

var wrapper = function () {
	// Bot already defined
	// @ts-ignore
	let bot = new Bot();

	self.onmessage = function (msg: any) {
		let result = bot.onData(msg.data);
		// @ts-ignore
		self.postMessage( result );
	};
}