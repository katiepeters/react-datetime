import * as React from 'react'
import symbols from '../../../../../lambdas/_common/utils/symbols';
import { Card, ScreenWrapper } from '../../../components';
import exchangeLoader from '../../../state/loaders/exchange.loader';
import { ScreenProps } from '../../../types';
import deploymentLoader from '../deployment.loader';
import PortfolioHistoryWidget from './widgets/PortfolioHistoryWidget';
import PortfolioWidget from './widgets/PortfolioWidget';
import ReturnsWidget from './widgets/ReturnsWidget';

export default class DeploymentStatsScreen extends React.Component<ScreenProps> {
	render() {

		return (
			<ScreenWrapper title="stats">
				{ this.renderContent() }
			</ScreenWrapper>
		)
	}

	renderContent() {
		let { data: deployment } = deploymentLoader.getData(this.getDeploymentId());
		if (!deployment) {
			return <Card>Loading...</Card>;
		}

		let { data: exchange } = exchangeLoader.getData(deployment.exchangeAccountId);
		if (!exchange) {
			return <Card>Loading...</Card>;
		}

		const {baseAssets, quotedAsset} = this.getAssets( deployment.symbols );
		return (
			<div>
				<PortfolioWidget
					baseAssets={baseAssets}
					quotedAsset={quotedAsset}
					exchangeAccount={ exchange } />
				<PortfolioHistoryWidget
					baseAssets={baseAssets}
					quotedAsset={quotedAsset}
					exchangeAccount={ exchange } />
				<ReturnsWidget
					baseAssets={baseAssets}
					quotedAsset={quotedAsset}
					exchangeAccount={ exchange } />
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
