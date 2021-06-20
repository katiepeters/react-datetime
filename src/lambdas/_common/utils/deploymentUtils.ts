import { DBBotDeployment } from "../../model.types";

export function isNewDeployment( deployment: DBBotDeployment ){
	return deployment.state?.newState === 'stateNew';
}

export function isActiveDeployment( {active}: DBBotDeployment ): boolean{
	return active;
}

export function getActivatedDeployment( currentDeployment: DBBotDeployment ): DBBotDeployment{
	let activeIntervals = [...currentDeployment.activeIntervals];
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

export function getDeactivatedDeployment( currentDeployment: DBBotDeployment ){
	let activeIntervals = [...currentDeployment.activeIntervals];
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