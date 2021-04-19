import * as React from 'react'
import styles from './_DeploymentsScreen.module.css';
import deploymentsLoader from './deployments.loader';
import { ScreenProps } from '../../types';

export default class DeploymentsScreen extends React.Component<ScreenProps> {

	render() {
		return (
			<div className={styles.container}>
				<h1>Deployments</h1>
				{ this.renderDeployments() }
				<button>Create deployment</button>
			</div>
		);
	}

	renderDeployments() {
		const { data, isLoading } = deploymentsLoader.getData(this, this.props.store.authenticatedId);

		if( isLoading ) return 'Loading...';

		if( !data?.length ) return 'No deployments yet.';

		
	}
}
