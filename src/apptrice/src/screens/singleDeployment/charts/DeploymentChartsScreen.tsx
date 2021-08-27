import * as React from 'react'
import { Orders } from '../../../../../lambdas/lambda.types';
import { FullBotDeployment, ModelBotDeployment } from '../../../../../lambdas/model.types';
import DeploymentCharts from '../../../common/charts/DeploymentCharts';
import { Card, ScreenWrapper } from '../../../components';
import { SingleDeploymentScreenProps } from '../SingleDeploymentScreenProps';
import styles from './_DeploymentChartsScreen.module.css';

export default class DeploymentChartsScreen extends React.Component<SingleDeploymentScreenProps> {
	state = {
		activeTab: ''
	}

	render() {
		const {deployment} = this.props;
		let symbols = this.getSymbols( deployment );

		return (
			<ScreenWrapper title="Charts">
				{ this.renderContent( deployment ) }
			</ScreenWrapper>
		)
	}

	renderContent(deployment: FullBotDeployment) {
		return (
			<DeploymentCharts
				exchangeProvider="bitfinex"
				deployment={ deployment } />
		);
	}

	getDeploymentId() {
		return this.props.router.location.params.id;
	}

	getSymbols(deployment: ModelBotDeployment): Orders | undefined {
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
