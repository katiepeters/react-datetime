import * as React from 'react'
import { ConsoleEntry, DBBotDeployment } from '../../../../../lambdas/model.types';
import ConsolePanel from '../../../common/consolePanel/ConsolePanel';
import { Card, ScreenWrapper } from '../../../components';
import { ScreenProps } from '../../../types';
import deploymentLoader from '../deployment.loader';
import styles from './_DeploymentLogsScreen.module.css';

export default class DeploymentLogsScreen extends React.Component<ScreenProps> {
	render() {
		let { data: deployment } = deploymentLoader.getData(this, this.getDeploymentId())
		let logs = this.getLogs( deployment );
		return (
			<ScreenWrapper title="logs">
				{ this.renderLogs(logs) }
			</ScreenWrapper>
		)
	}

	renderLogs(logs?: any) {
		if( !logs ){
			return <Card>Loading...</Card>
		}

		return (
			<ConsolePanel
				logs={ logs} />
		);
	}

	getDeploymentId() {
		return this.props.router.location.params.id;
	}

	getLogs(deployment?: DBBotDeployment): ConsoleEntry[] | undefined {
		if( !deployment ) return;
		// @ts-ignore
		return deployment.logs.flatten();
	}
}
