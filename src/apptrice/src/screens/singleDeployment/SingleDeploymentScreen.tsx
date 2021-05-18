import * as React from 'react'
import AppMenu from '../../AppMenu';
import { SidebarLayout } from '../../components';
import { ScreenProps } from '../../types'
import deploymentLoader from './deployment.loader'


export default class SingleDeploymentScreen extends React.Component<ScreenProps> {
	render() {
		let {data, isLoading} = deploymentLoader.getData( this.getDeploymentId() )
		console.log( data, isLoading );

		let Subscreen = this.getSubscreen();
		return (
			<SidebarLayout
				sidebar={ this.renderMenu() }
				sidebarWidth={65}
				bgColor="#061725">
				<Subscreen {...this.props} />
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
			{ name: 'Stats', icon: 'percentage', link: `#/deployments/${id}` },
			{ name: 'Charts', icon: 'chart-bar', link: `#/deployments/${id}/charts` },
			{ name: 'Orders', icon: 'exchange-alt', link: `#/deployments/${id}/orders` },
			{ name: 'State', icon: 'paperclip', link: `#/deployments/${id}/state`},
			{ name: 'Logs', icon: 'file-alt', link: `#/deployments/${id}/logs` },
		]
	}

	getSubscreen() {
		return this.props.router.location.matches[2] || (() => <span>Single deployment</span>);
	}
}