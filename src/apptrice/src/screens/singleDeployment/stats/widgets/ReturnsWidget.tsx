import * as React from 'react'
import styles from './_ReturnsWidget.module.css';
import {Line} from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { Card } from '../../../../components';
import { PortfolioHistoryItem } from '../../../../../../lambdas/model.types';
import memoizeOne from 'memoize-one';
import trim from '../../../../utils/trim';
import { BtDeployment } from '../../../../utils/backtest/Bt.types';
import { getDeploymentAssets, getPortfolioValue } from '../../../../../../lambdas/_common/utils/deploymentUtils';

interface ReturnsWidgetProps {
	deployment?: BtDeployment
}

export default class ReturnsWidget extends React.Component<ReturnsWidgetProps> {
	render() {
		return (
			<div className={styles.container}>
				<Card>
					<div>
						<h3>Returns</h3>
					</div>
					{ this.renderContent() }
				</Card>
			</div>
		)
	}


	renderContent() {
		if( !this.hasHistory() ){
			return 'This bot has not been run yet.';
		}

		const data = this.getData();
		const options = this.getOptions();
		return (
			<Line
				type="line"
				data={data}
				options={options} />
		);
	}

	hasHistory(){
		const {deployment} = this.props;
		if( !deployment || !deployment.portfolioHistory ) return false;

		const {portfolioHistory} = deployment;
		return portfolioHistory && Object.keys(portfolioHistory).length > 0;
	}


	getOptions() {
		return {
			radius: 0,
			scales: {
				x: {
					type: 'time',
					ticks: {
						source: 'labels'
					}
				},
				y: {
					ticks: {
						callback: (value: string) => `${value}%`
					},
					grid: {
						drawBorder: false,
						color: 'rgba(255,255,255,.3)',
						zeroLineWidth: 1,
						zeroLineColor: 'rgba(255,255,255,.5)'
					}
				}
			},
			interaction: {
				intersect: false,
				mode: 'index'
			},
			plugins: {
				tooltip: {
					callbacks: {
						label: (context:any) => {
							return `${context.dataset.label}: ${trim(context.parsed.y)}%`;
						}
					}
				}
			},
			pointBorderColor: '#fff'
		};
	}


	getData() {
		const {deployment} = this.props;
		if( !deployment ) return;

		const {baseAssets} = getDeploymentAssets(deployment.symbols);
		return memoGetData( deployment.portfolioHistory, baseAssets );
	}
}


const memoGetData = memoizeOne( (portfolioHistory: PortfolioHistoryItem[], base: string[] ) => {
	let labels: number[] = [];
	let sets: {[asset:string]: number[]} = {
		bot: []
	};
	
	let initialPrices: {[asset:string]: number} = {
		bot: getPortfolioValue(portfolioHistory[0].balances)
	};

	base.forEach( (asset:string) => {
		sets[asset] = [];
		const balance = portfolioHistory[0].balances[asset];
		initialPrices[asset] = balance.price;
	});

	portfolioHistory.forEach( (item: PortfolioHistoryItem) => {
		// @ts-ignore
		labels.push( parseInt(item.date, 10) );
		let total = getPortfolioValue( item.balances );
		sets.bot.push( (total / initialPrices.bot * 100) - 100);

		base.forEach( (asset:string) => {
			const balance = item.balances[asset];
			sets[asset].push( (balance.price / initialPrices[asset] * 100) - 100 );
		});
	});

	return {
		labels,
		datasets: Object.keys(sets).map( (asset: string, i: number) => ({
			label: asset === 'bot' ? 'Bot' : asset,
			data: sets[asset],
			borderColor: asset === 'bot' ? 'red' : `rgb(${i*55 + 50},${i*55 + 50},${i*55 + 60})`,
			backgroundColor: asset === 'bot' ? 'red' : `rgb(${i*55 + 50},${i*55 + 50},${i*55 + 60})`,
		}))
	};
});
