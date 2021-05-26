import * as React from 'react'
import { Balance, Portfolio } from '../../../../../../lambdas/lambda.types';
import { Card, Table } from '../../../../components';
import exchangeLoader from '../../../../state/loaders/exchange.loader';
import priceLoader from '../../../../state/loaders/price.loader';
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
				columns={ this.getColumns() }
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

	getColumns() {
		return [
			{ field: 'asset', title: 'Asset' },
			{ field: 'free', title: 'Free', renderFn: this._renderPrice },
			{ field: 'total', title: 'Total', renderFn: this._renderPrice }
		];
	}

	_renderPrice = (item: Balance, field?: string) => {
		let { data: exchange } = exchangeLoader.getData(this.props.exchangeId);
		// @ts-ignore
		let amount = item[field];
		let { data: value } = priceLoader.getData(exchange.provider, amount, `${item.asset}/${this.props.quotedAsset}` );
		return (
			<div>
				<div>{ amount }</div>
				<div>
					{ value === undefined ? '...' : value } {this.props.quotedAsset}
				</div>
			</div>
		);
	}
}
