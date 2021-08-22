import { DBBotDeployment, DeploymentOrders, PortfolioWithPrices, SimpleBotDeployment } from "../../model.types";

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
		return {
			...currentDeployment,
			active: false,
			activeIntervals
		};
	}
	return currentDeployment;
}

export function getDeploymentAssets( symbols: string[] ){
	return {
		quotedAsset: symbols[0].split('/')[1],
		baseAssets: symbols.map( (s: string) => s.split('/')[0] )
	};
}

export function getPortfolioValue( portfolio: PortfolioWithPrices ){
	let total = 0;
	Object.keys( portfolio ).forEach( asset => {
		const balance = portfolio[asset];
		total += balance.total * balance.price;
	});
	return total;
}