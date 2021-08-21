import { DBBotDeployment, SimpleBotDeployment } from "../../model.types";

export function isNewDeployment( deployment: DBBotDeployment ){
	return deployment.state?.newState === 'stateNew';
}

export function isActiveDeployment( {active}: SimpleBotDeployment ): boolean{
	return active;
}

export function getActivatedDeployment<T extends DBBotDeployment | SimpleBotDeployment>( currentDeployment: T ): T{
	let activeIntervals = [...(currentDeployment.activeIntervals||[])];
	let [lastActiveInterval] = activeIntervals.slice(-1);
	if( !lastActiveInterval || lastActiveInterval.length === 2 ){
		activeIntervals.push([Date.now()]);
		return {
			...currentDeployment,
			active: true,
			activeIntervals
		};
	}
	return currentDeployment;
}

export function getDeactivatedDeployment<T extends DBBotDeployment | SimpleBotDeployment>( currentDeployment: T ){
	let activeIntervals = [...(currentDeployment.activeIntervals||[])];
	let [lastActiveInterval] = activeIntervals.slice(-1);
	if( lastActiveInterval && lastActiveInterval.length === 1 ){
		lastActiveInterval.push(Date.now());
		console.log('DEPLOYMEN', currentDeployment);
		return {
			...currentDeployment,
			active: false,
			activeIntervals
		};
	}
	return currentDeployment;
}