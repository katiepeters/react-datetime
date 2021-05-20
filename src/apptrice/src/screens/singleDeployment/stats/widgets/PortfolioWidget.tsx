import * as React from 'react'
import { Balance, Portfolio } from '../../../../../../lambdas/lambda.types';
import { Card, Table } from '../../../../components';
import exchangeLoader from '../../../../state/loaders/exchange.loader';
import styles from './_PortfolioWidget.module.css';

interface PortfolioWidgetProps {
	exchangeId: string
	baseAssets: string[]
	quotedAsset: string
}

export default class PortfolioWidget extends React.Component<PortfolioWidgetProps> {
	render() {
		return (
			<div className={styles.container}>
				<Card>
					<div>
						<h3>Portfolio</h3>
					</div>
					{ this.renderContent() }
				</Card>
			</div>
		)
	}

	renderContent() {
		let { data: exchange } = exchangeLoader.getData(this.props.exchangeId);
		if (!exchange || !exchange.portfolioHistory) return <div>Loading...</div>;

		let {portfolioHistory} = exchange;
		if( !portfolioHistory.length ){
			return <div>The bot has not run yet. No portfolio available.</div>
		}
		
		let lastPortfolio = portfolioHistory[portfolioHistory.length - 1];
		return (
			<Table
				data={ this.getData(lastPortfolio) }
				keyField="asset"
			/>
		);
	}

	getData( portfolio: Portfolio ) {
		const {baseAssets, quotedAsset} = this.props;
		return Object.values(portfolio.balances)
			.filter( (balance: Balance) => (
				balance.asset === quotedAsset || baseAssets.includes(balance.asset)
			))
		;
	}
}
