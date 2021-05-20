import * as React from 'react'
import symbols from '../../../../../lambdas/_common/utils/symbols';
import { Card, ScreenWrapper } from '../../../components';
import { ScreenProps } from '../../../types';
import deploymentLoader from '../deployment.loader';
import PortfolioWidget from './widgets/PortfolioWidget';

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

		const {baseAssets, quotedAsset} = this.getAssets( deployment.symbols );
		return (
			<PortfolioWidget
				baseAssets={baseAssets}
				quotedAsset={quotedAsset}
				exchangeId={ deployment.exchangeAccountId } />
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
