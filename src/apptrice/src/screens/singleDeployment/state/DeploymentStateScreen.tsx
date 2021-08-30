import * as React from 'react'
import { DBBotDeploymentState } from '../../../../../lambdas/model.types';
import { Card, ScreenWrapper } from '../../../components';
import { SingleDeploymentScreenProps } from '../SingleDeploymentScreenProps';
// import styles from './_DeploymentStateScreen.module.css';

export default class DeploymentStateScreen extends React.Component<SingleDeploymentScreenProps> {
	render() {
		const {state} = this.props.deployment;
		return (
			<ScreenWrapper title="state data">
				{ this.renderState(state)}
			</ScreenWrapper>
		)
	}

	renderState(state: DBBotDeploymentState) {
		return (
			<Card>
				<pre>{JSON.stringify(state, null, 2)}</pre>
			</Card>
		);
	}
}
