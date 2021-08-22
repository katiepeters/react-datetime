import { ls } from "../../utils/Ls";
import { emitStateChange } from "../stateManager";

export function setEnvironment(type: 'local' | 'awsTest'){
	ls.setItem('env', type);
	emitStateChange();
}