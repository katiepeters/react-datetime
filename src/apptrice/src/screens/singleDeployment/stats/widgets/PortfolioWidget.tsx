import * as React from 'react'
import { Card, Table } from '../../../../components';
import exchangeLoader from '../../../../state/loaders/exchange.loader';
import styles from './_PortfolioWidget.module.css';

interface PortfolioWidgetProps {
	exchangeId: string
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
		let { data: exchange } = exchangeLoader.getData(this, this.props.exchangeId);
		if (!exchange || !exchange.portfolioHistory) return <div>Loading...</div>;

		let {portfolioHistory} = exchange;
		if( !portfolioHistory.length ){
			return <div>The bot has not run yet. No portfolio available.</div>
		}
		
		let lastPortfolio = portfolioHistory[portfolioHistory.length - 1];
		return (
			<Table
				data={Object.values(lastPortfolio.balances) || []}
				keyField="asset"
			/>
		);
	}
}
