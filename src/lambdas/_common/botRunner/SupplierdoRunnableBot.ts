import lambdaUtil from "../utils/lambda";
import { BotRunInput, RunnableBot } from "./BotRunner";

export class SupplierdoRunnableBot implements RunnableBot {
	source: string =  ''

	async prepare( source: string ){
		this.source = source;
	}

	async run( input: BotRunInput ) {
		return {
			currentDate: Date.now(),
			...( await lambdaUtil.invokeExecutor({
				botSource: this.source,
				...input,
			}))
		};
	}
}