import * as React from 'react'
import AppMenu from '../../AppMenu';
import { SidebarLayout } from '../../components';
import { ScreenProps } from '../../types'
import deploymentLoader from './deployment.loader'


export default class SingleDeploymentScreen extends React.Component<ScreenProps> {
	render() {
		let {data, isLoading} = deploymentLoader.getData(this, this.getDeploymentId() )
		console.log( data, isLoading );

		return (
			<SidebarLayout
				sidebar={ this.renderMenu() }
				sidebarWidth={65}
				bgColor="#061725">
				<div>
					Single deployment screen
				</div>
			</SidebarLayout>
		)
	}

	renderMenu() {
		return (
			<AppMenu
				title="Deployment"
				items={ this.getItems() }
				currentPath={ this.props.router.location.pathname } />
		);
	}

	getDeploymentId(){
		return this.props.router.location.params.id;
	}

	getItems() {
		let id = this.props.router.location.params.id;

		return [
			{ name: 'Orders', icon: 'exchange-alt', link: `#/deployments/${id}/orders` },
			{ name: 'State', icon: 'paperclip', link: `#/deployments/${id}/state`},
			{ name: 'Logs', icon: 'file-alt', link: `#/deployments/${id}/logs` },
		]
	}
}