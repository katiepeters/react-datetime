import * as React from 'react'
import { Balance } from '../../../../../../lambdas/lambda.types';
import { DbExchangeAccount, PortfolioHistoryItem } from '../../../../../../lambdas/model.types';
import { Card, Table } from '../../../../components';
import priceLoader from '../../../../state/loadersOld/price.loader';
import trim from '../../../../utils/trim';
import styles from './_PortfolioWidget.module.css';

interface PortfolioWidgetProps {
	exchangeAccount: DbExchangeAccount
	baseAssets: string[]
	quotedAsset: string
}

export default class PortfolioWidget extends React.Component<PortfolioWidgetProps> {
	render() {
		return (
			<div className={styles.container}>
				<Card>
					<div>
						<h3>Balances</h3>
					</div>
					{ this.renderContent() }
				</Card>
			</div>
		)
	}

	renderContent() {
		let portfolioHistory = this.getPortfolioHistory();
		if (!portfolioHistory) return <div>Loading...</div>;
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

	getPortfolioHistory() {
		return this.props.exchangeAccount.portfolioHistory;
	}

	getData( portfolio: PortfolioHistoryItem ) {
		const {baseAssets, quotedAsset} = this.props;
		let data = Object.values(portfolio.balances)
			.filter( (balance: Balance) => (
				balance.asset === quotedAsset || baseAssets.includes(balance.asset)
			))
		;

		data.push({
			asset: 'Total',
			free: 0,
			total: 0,
			price: 0
		});

		return data;
	}

	getColumns() {
		return [
			{ field: 'asset', title: 'Asset' },
			{ field: 'free', title: 'Free', renderFn: this._renderPrice },
			{ field: 'total', title: 'Total', renderFn: this._renderPrice }
		];
	}

	_renderPrice = (item: Balance, field?: string) => {
		const {exchangeAccount} = this.props;

		// @ts-ignore
		let amount = item[field];
		let { data: value } = priceLoader.getData(exchangeAccount.provider, amount, `${item.asset}/${this.props.quotedAsset}` );
		if( item.asset === 'Total' ){
			return field === 'total' ? this.renderTotal() : <span />;
		}

		return (
			<div>
				<div>{ trim(amount, 7) }</div>
				<div>
					{ value === undefined ? '...' : trim(value,7) } {this.props.quotedAsset}
				</div>
			</div>
		);
	}

	renderTotal() {
		// All these variables have been already loaded
		const portfolioHistory = this.getPortfolioHistory();
		if( !portfolioHistory ) return <span></span>;

		const lastPortfolio = portfolioHistory[portfolioHistory.length - 1];
		const {exchangeAccount} = this.props;

		let total = 0;
		this.getData( lastPortfolio ).forEach( (balance: Balance) => {
			if( balance.asset === 'Total' ) return;
			// @ts-ignore
			let amount = balance.total;
			let { data: value } = priceLoader.getData(exchangeAccount.provider, String(amount), `${balance.asset}/${this.props.quotedAsset}` );
			total += value;
		});

		return <span>{trim(total, 7)} {this.props.quotedAsset}</span>;
	}
}
