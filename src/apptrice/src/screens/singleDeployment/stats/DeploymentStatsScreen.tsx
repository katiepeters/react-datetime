import * as React from 'react'
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
		let { data: deployment } = deploymentLoader.getData(this, this.getDeploymentId());
		if (!deployment) {
			return <Card>Loading...</Card>;
		}

		return (
			<PortfolioWidget
				exchangeId={ deployment.exchangeAccountId } />
		);
	}

	getDeploymentId() {
		return this.props.router.location.params.id;
	}
}
