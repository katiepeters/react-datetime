import * as React from 'react'
import { Card } from '../../../../components';
import styles from './_PortfolioHistoryWidget.module.css';

import {Line} from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

import { PortfolioHistoryItem, RunnableDeployment } from '../../../../../../lambdas/model.types';
import memoizeOne from 'memoize-one';
import trim from '../../../../utils/trim';
import { getDeploymentAssets } from '../../../../../../lambdas/_common/utils/deploymentUtils';

interface PortfolioHistoryWidgetProps {
	deployment: RunnableDeployment
}

export default class PortfolioHistoryWidget extends React.Component<PortfolioHistoryWidgetProps> {
	render() {
		return (
			<div className={styles.container}>
				<Card>
					<div>
						<h3>Portfolio history</h3>
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

	getData() {
		const {deployment} = this.props;
		return memoGetData( deployment.portfolioHistory || [] );
	}

	getOptions() {
		const {quotedAsset} = getDeploymentAssets(this.props.deployment.pairs);
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
					min: 0
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
							let datasets = context.chart.data.datasets;
							let total = datasets[ datasets.length - 1 ].data[context.dataIndex];
							let amount = context.parsed.y;
							if( context.datasetIndex ){
								amount -= datasets[context.datasetIndex - 1].data[context.dataIndex];
							}

							let percentage = trim( (amount / total) * 100, 2);
							return `${context.dataset.label}: ${percentage}%`;
						},
						footer: (elements: any[]) => {
							let lastElement = elements[ elements.length - 1];
							return `Total: ${trim(lastElement.parsed.y, 5)} ${quotedAsset} (${this.getReturn(lastElement.parsed.y)}%)`;
						}
					}
				}
			},
			pointBorderColor: '#fff'
		};
	}

	getReturn( value: number ){
		const datasets = this.getData().datasets;
		let total = datasets[datasets.length - 1].data[0];

		let ret = (value/total*100) - 100;
		return ret > 0 ?
			`+${trim(ret, 2)}` :
			trim(ret, 2)
		;
	}

	hasHistory(){
		const {portfolioHistory} = this.props.deployment;
		return portfolioHistory && portfolioHistory.length > 0;
	}
}


const memoGetData = memoizeOne( (portfolioHistory: PortfolioHistoryItem[] ) => {
	let labels: number[] = [];
	let sets: {[asset:string]: number[]} = {};
	const assets = Object.keys(portfolioHistory[0].balances)
	assets.forEach( (asset:string) => {
		sets[asset] = [];
	});

	portfolioHistory.forEach( (item: PortfolioHistoryItem) => {
		// @ts-ignore
		labels.push( parseInt(item.date, 10) );
		
		let total = 0;
		assets.forEach( (asset:string) => {
			let balance = item.balances[asset];
			if( balance ){
				total += (balance.total * balance.price);
			}
			sets[asset].push( total );
		});
	});

	return {
		labels,
		datasets: assets.map( (asset: string, i: number) => ({
			label: asset,
			data: sets[asset],
			fill: true,
			backgroundColor: `rgb(${i*55 + 50},${i*55 + 50},${i*55 + 60})`,
			borderColor: `rgb(${i*55 + 50},${i*55 + 50},${i*55 + 60}, .2)`
		}))
	}
});
