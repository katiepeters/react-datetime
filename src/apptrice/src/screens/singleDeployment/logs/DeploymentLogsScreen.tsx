import * as React from 'react'
import ConsolePanel from '../../../common/consolePanel/ConsolePanel';
import { Card, ScreenWrapper } from '../../../components';
import { SingleDeploymentScreenProps } from '../SingleDeploymentScreenProps';
// import styles from './_DeploymentLogsScreen.module.css';

export default class DeploymentLogsScreen extends React.Component<SingleDeploymentScreenProps> {
	render() {
		const {deployment} = this.props;
		
		return (
			<ScreenWrapper title="logs">
				{ this.renderLogs(deployment.logs) }
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
}
