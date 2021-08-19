import * as React from 'react'
import { Orders } from '../../../../../lambdas/lambda.types';
import { DBBotDeployment, DBBotDeploymentWithHistory } from '../../../../../lambdas/model.types';
import DeploymentCharts from '../../../common/charts/DeploymentCharts';
import { Card, ScreenWrapper } from '../../../components';
import { ScreenProps } from '../../../types';
import deploymentLoader from '../deployment.loader';
import styles from './_DeploymentChartsScreen.module.css';

export default class DeploymentChartsScreen extends React.Component<ScreenProps> {
	state = {
		activeTab: ''
	}

	render() {
		let { data: deployment } = deploymentLoader.getData(this.getDeploymentId())
		let symbols = this.getSymbols( deployment );

		return (
			<ScreenWrapper title="Charts">
				{ this.renderContent( deployment ) }
			</ScreenWrapper>
		)
	}

	renderContent(deployment?: DBBotDeploymentWithHistory) {
		if (!deployment ){
			return <Card>Loading...</Card>
		}

		return (
			<DeploymentCharts
				exchangeProvider="bitfinex"
				deployment={ deployment } />
		);
	}

	getDeploymentId() {
		return this.props.router.location.params.id;
	}

	getSymbols(deployment?: DBBotDeployment): Orders | undefined {
		if (!deployment) return;
		// @ts-ignore
		return deployment.symbols.flatten ?
		// @ts-ignore
			deployment.symbols.flatten() :
			deployment.symbols
		;
	}

	componentDidMount() {

	}

	componentDidUpdate() {

	}
}
