import { BotConfigurationExtra } from "../../lambda.types";
import lambdaUtil from "../utils/lambda";
import { BotRunInput, RunnableBot } from "./BotRunner";

export class SupplierdoRunnableBot extends SupplierdoRunnable {
	source: string =  ''

	prepare( source: string ){
		this.source = source;
	}

	run( input: BotRunInput ) {
		return lambdaUtil.invokeExecutor({
			botSource: this.source,
			...input,
		})
	}
}