import * as React from 'react'
import { ScreenProps } from '../../types'
import deploymentLoader from './deployment.loader'


export default class SingleDeploymentScreen extends React.Component<ScreenProps> {
	render() {
		let {data, isLoading} = deploymentLoader.getData(this, this.getDeploymentId() )
		console.log( data, isLoading );

		return (
			<div>
				Single deployment screen
			</div>
		)
	}

	getDeploymentId(){
		return this.props.router.location.params.id;
	}
}
