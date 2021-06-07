import { DBBotDeployment } from "../../model.types";

export function isNewDeployment( deployment: DBBotDeployment ){
	return deployment.state?.newState === 'stateNew';
}