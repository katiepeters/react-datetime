import * as React from 'react'
import styles from './_DeploymentsScreen.module.css';
import deploymentsLoader from './deployments.loader';
import { ScreenProps } from '../../types';
import { Button, ScreenWrapper, Table } from '../../components';

export default class DeploymentsScreen extends React.Component<ScreenProps> {

	render() {
		return (
			<ScreenWrapper title="Deployments" titleExtra={ <Button size="s">Create new deployment</Button> } >
				{ this.renderDeployments() }
			</ScreenWrapper>
		);
	}

	renderDeployments() {
		const { data, isLoading } = deploymentsLoader.getData(this, this.props.store.authenticatedId);

		if( isLoading ) return 'Loading...';

		if( !data?.length ) return 'No deployments yet.';

		return (
			<Table
				data={ data }
				keyField="id"
			/>
		);

	}
}
