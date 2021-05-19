import * as React from 'react'
import { Orders } from '../../../../../lambdas/lambda.types';
import { DBBotDeployment } from '../../../../../lambdas/model.types';
import { Card, ScreenWrapper, Tab, Tabs } from '../../../components';
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
				<div>
					<Tabs active={ this.state.activeTab }
						onChange={(activeTab: string) => this.setState({activeTab}) }>
						<Tab id="id1">Text1</Tab>
						<Tab id="id2">Text2</Tab>
					</Tabs>
				</div>
				{ JSON.stringify(symbols) }
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
