import * as React from 'react'
import styles from './_ReturnsWidget.module.css';


import {Line} from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { Card } from '../../../../components';
import { DbExchangeAccount, PortfolioHistoryItem } from '../../../../../../lambdas/model.types';
import memoizeOne from 'memoize-one';
import priceRangeLoader from '../../../../state/loadersOld/priceRange.loader';
import historicalPriceLoader from '../../../../state/loadersOld/historicalPrice.loader';
import historicalValueLoader from '../../../../state/loadersOld/historicalValue.loader';
import trim from '../../../../utils/trim';

interface ReturnsWidgetProps {
	exchangeAccount: DbExchangeAccount
	baseAssets: string[]
	quotedAsset: string
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

		if( this.isLoadingPrices() ){
			return 'Loading...';
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

	isLoadingPrices() {
		const {baseAssets, quotedAsset, exchangeAccount} = this.props;
		const {provider, portfolioHistory} = exchangeAccount;
		if( !portfolioHistory || !this.hasHistory() ) return true;

		const symbols = baseAssets.map( (asset: string) => `${asset}/${quotedAsset}`);
		const startDate = portfolioHistory[0].date;
		const endDate = portfolioHistory[portfolioHistory.length - 1].date;

		let loading = false;
		symbols.forEach( (symbol:string) => {
			const {isLoading} = priceRangeLoader.getData(provider, symbol, startDate, endDate);
			loading = loading || isLoading;
		});

		return loading;
	}

	hasHistory(){
		const {portfolioHistory} = this.props.exchangeAccount;
		
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
		const {exchangeAccount, baseAssets, quotedAsset} = this.props;
		return memoGetData( exchangeAccount.portfolioHistory || [], quotedAsset, baseAssets, exchangeAccount.provider );
	}
}


const memoGetData = memoizeOne( (portfolioHistory: PortfolioHistoryItem[], quoted: string, base: string[], provider: string ) => {
	let labels: number[] = [];
	let sets: {[asset:string]: number[]} = {
		bot: []
	};
	let initialPrices: {[asset:string]: number} = {
		bot: portfolioHistory[0].balances[quoted].total
	};

	base.forEach( (asset:string) => {
		sets[asset] = [];
		const balance = portfolioHistory[0].balances[asset];
		const initialAmount = balance?.total || 0;
		const {data: price} = historicalPriceLoader.getData( provider, `${asset}/${quoted}`, portfolioHistory[0].date );
		const {data: value} = historicalValueLoader.getData( provider, `${asset}/${quoted}`, initialAmount, portfolioHistory[0].date );
		initialPrices[asset] = price;
		initialPrices.bot += value;
	});

	portfolioHistory.forEach( (item: PortfolioHistoryItem) => {
		// @ts-ignore
		labels.push( parseInt(item.date, 10) );

		let total = item.balances[quoted].total;
		base.forEach( asset => {
			const balance = item.balances[asset];
			const amount = balance?.total || 0;
			const {data: price} = historicalPriceLoader.getData( provider, `${asset}/${quoted}`, item.date );
			const {data: value} = historicalValueLoader.getData( provider, `${asset}/${quoted}`, amount, item.date );
			sets[asset].push( (price / initialPrices[asset] * 100) - 100 );
			total += value;
		});

		sets.bot.push( (total / initialPrices.bot * 100) - 100);
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
