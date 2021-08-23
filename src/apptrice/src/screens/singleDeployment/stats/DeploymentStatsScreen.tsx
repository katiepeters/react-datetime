import * as React from 'react'
import symbols from '../../../../../lambdas/_common/utils/symbols';
import { Card, ScreenWrapper } from '../../../components';
import { exchangeLoader } from '../../../state/loaders/exchange.loader';
import { SingleDeploymentScreenProps } from '../SingleDeploymentScreenProps';
import PortfolioHistoryWidget from './widgets/PortfolioHistoryWidget';
import PortfolioWidget from './widgets/PortfolioWidget';
import ReturnsWidget from './widgets/ReturnsWidget';

export default class DeploymentStatsScreen extends React.Component<SingleDeploymentScreenProps> {
	render() {

		return (
			<ScreenWrapper title="stats">
				{ this.renderContent() }
			</ScreenWrapper>
		)
	}

	renderContent() {
		const { deployment } = this.props;
		const {accountId, exchangeAccountId, symbols} = deployment;
		let { data: exchange } = exchangeLoader({accountId, exchangeId: exchangeAccountId});
		if (!exchange) {
			return <Card>Loading...</Card>;
		}

		const {baseAssets, quotedAsset} = this.getAssets( symbols );
		return (
			<div>
				<PortfolioHistoryWidget
					deployment={ deployment } />
				<ReturnsWidget
					deployment={ deployment } />
			</div>
		);
	}

	getDeploymentId() {
		return this.props.router.location.params.id;
	}

	getAssets(deploySymbols: string[]){
		let quotedAsset: string = '';
		let baseAssets: string[] = [];
		deploySymbols.forEach( (symbol: string) => {
			if( !quotedAsset ){
				quotedAsset = symbols.getQuoted(symbol);
			}
			baseAssets.push(symbols.getBase(symbol));
		});
		return {quotedAsset, baseAssets}
	}
}
