import memoizeOne from "memoize-one";
import {DeploymentOrders, PortfolioHistoryItem } from "../../../../lambdas/model.types";
import BtOrders from "../../screens/singleBot/botBt/sections/BtOrders";
import { BtDeployment } from "../../utils/backtest/Bt.types";

export interface DeploymentStats {
	initialValue: number,
	finalValue: number,
	netProfitPercent: number
}

export function getStats( deployment: BtDeployment ){
	return calculateStatsMemo(deployment);
}

const calculateStatsMemo = memoizeOne( (deployment: BtDeployment) => {
	const runningInterval = getRunningInterval( deployment );
	const queryAsset = deployment.symbols[0].split('/')[1];

	return {
		...calculatePortfolioMetrics( queryAsset, deployment.portfolioHistory ),
		...calculateOrderMetrics( runningInterval, deployment.orders )
	}
});


function calculatePortfolioMetrics( queryAsset: string, history: PortfolioHistoryItem[] ){
	const initialValue = getPortfolioValue(history[0]);
	const finalValue = getPortfolioValue(history[history.length-1]);

	let maxValue = -Infinity;
	let minValue = Infinity;
	let maxDropdown = 1;
	let exposureIterations = 0;

	history.forEach( h => {
		let value = getPortfolioValue(h);
		if( value > maxValue ){
			maxValue = value;
		}
		if( value < minValue ){
			minValue = value;
		}
		if( maxValue / value > maxDropdown ){
			maxDropdown = maxValue / value
		}
		if( isExposed( queryAsset, h, value) ){
			exposureIterations++;
		}
	})

	return {
		initialValue,
		finalValue,
		netProfitPercent: ((finalValue / initialValue) - 1) * 100,
		maxValue,
		minValue,
		maxDropdownPercent: (1 - maxDropdown) * 100,
		exposurePercent: exposureIterations / history.length * 100
	}
}

function calculateOrderMetrics( runningInterval: [number, number], orders: DeploymentOrders){
	let ids = Object.keys( orders.items );

	let completedOrdersCount = 0;
	let errorOrdersCount = 0;
	let openOrdersCount = 0;
	let cancelledOrdersCount = 0;

	ids.forEach( (id:string) => {
		let order = orders.items[id];
		switch( order.status ){
			case 'cancelled':
				cancelledOrdersCount++;
				break;
			case 'completed':
				completedOrdersCount++;
				break;
			case 'error':
				errorOrdersCount++;
				break;
			default:
				openOrdersCount++;
		}
	});

	return {
		ordersCount: ids.length,
		completedOrdersCount,
		errorOrdersCount,
		openOrdersCount,
		cancelledOrdersCount,
	}
}

function getPortfolioValue( {balances}: PortfolioHistoryItem ){
	let value = 0;
	for( let asset in balances ){
		value += balances[asset].total * balances[asset].price;
	}
	return value;
}

function getRunningInterval( {activeIntervals, portfolioHistory}: BtDeployment ): [number, number] {
	return [
		activeIntervals[0][0],
		portfolioHistory[portfolioHistory.length - 1].date
	];
}

function isExposed( queryAsset: string, history: PortfolioHistoryItem, totalValue: number ){
	let assets = Object.keys(history.balances);
	let i = assets.length;
	while( i-- > 0 ){
		if( assets[i] !== queryAsset ){
			let balance = history.balances[assets[i]];
			if( balance.total * balance.price > totalValue / 200 ){
				// If there is an asset other than the quoted, whose value is greater
				// than the 0.5% of the total, we are exposed
				return true;
			}
		}
	}
}