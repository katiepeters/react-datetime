import * as React from 'react'
import pairs from '../../../../../lambdas/_common/utils/pairs';
import { Card, ScreenWrapper } from '../../../components';
import { exchangeLoader } from '../../../state/loaders/exchange.loader';
import { SingleDeploymentScreenProps } from '../SingleDeploymentScreenProps';
import PortfolioHistoryWidget from './widgets/PortfolioHistoryWidget';
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
		const {accountId, exchangeAccountId} = deployment;
		let { data: exchange } = exchangeLoader({accountId, exchangeId: exchangeAccountId});
		if (!exchange) {
			return <Card>Loading...</Card>;
		}

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

	getAssets(deployPairs: string[]){
		let quotedAsset: string = '';
		let baseAssets: string[] = [];
		deployPairs.forEach( (pair: string) => {
			if( !quotedAsset ){
				quotedAsset = pairs.getQuoted(pair);
			}
			baseAssets.push(pairs.getBase(pair));
		});
		return {quotedAsset, baseAssets}
	}
}
