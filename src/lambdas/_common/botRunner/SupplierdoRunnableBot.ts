import lambdaUtil from "../utils/lambda";
import { BotRunInput, RunnableBot } from "./BotRunner";

export class SupplierdoRunnableBot implements RunnableBot {
	source: string =  ''

	async prepare( source: string ){
		this.source = source;
	}

	run( input: BotRunInput ) {
		return lambdaUtil.invokeExecutor({
			botSource: this.source,
			...input,
		})
	}
}