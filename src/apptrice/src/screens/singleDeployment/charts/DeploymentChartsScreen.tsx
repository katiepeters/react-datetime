import * as React from 'react'
import { Orders } from '../../../../../lambdas/lambda.types';
import { DBBotDeployment } from '../../../../../lambdas/model.types';
import { Card, ScreenWrapper } from '../../../components';
import { ScreenProps } from '../../../types';
import deploymentLoader from '../deployment.loader';
import styles from './_DeploymentChartsScreen.module.css';

export default class DeploymentChartsScreen extends React.Component<ScreenProps> {
	render() {
		let { data: deployment } = deploymentLoader.getData(this.getDeploymentId())
		let state = this.getState( deployment );
		return (
			<ScreenWrapper title="state data">
				{ this.renderState(state) }
			</ScreenWrapper>
		)
	}

	renderState(state?: any) {
		if( !state ){
			return <Card>Loading...</Card>
		}

		return (
			<Card>
				<pre>{ JSON.stringify(state, null, 2) }</pre>
			</Card>
		);
	}

	getDeploymentId() {
		return this.props.router.location.params.id;
	}

	getState(deployment?: DBBotDeployment): Orders | undefined {
		if( !deployment ) return;
		const state = deployment.state;
		// @ts-ignore
		return state.flatten ? state.flatten() : state;
	}
}
