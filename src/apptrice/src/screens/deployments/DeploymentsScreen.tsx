import * as React from 'react'
import styles from './_DeploymentsScreen.module.css';
import deploymentsLoader from './deployments.loader';
import { ScreenProps } from '../../types';
import { Button, ButtonList, DropDownButton, ScreenWrapper, Spinner, Table } from '../../components';
import { DBBotDeployment, DbBotInput } from '../../../../lambdas/model.types';
import { TableColumn } from '../../components/table/Table';
import apiCacher from '../../state/apiCacher';

export default class DeploymentsScreen extends React.Component<ScreenProps> {
	state = {
		loadingItems: {}
	}

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
				columns={ this.getColumns() }
			/>
		);

	}

	getColumns(): TableColumn<DBBotDeployment>[] {
		return [
			{ field: 'id' },
			{ field: 'botId' },
			{ field: 'active', title: '', renderFn: this._renderActive },
			{ field: 'controls', title: '', renderFn: this._renderControls, noSort: true }
		];
	}

	_renderActive = (item: DBBotDeployment) => {
		return <span>{item.active ? 'Active' : 'Inactive'}</span>;
	}

	_renderControls = (item: DBBotDeployment) => {
		// @ts-ignore
		if( this.state.loadingItems[item.id] ){
			return <Spinner />;
		}

		let buttons = [
			{
				label: item.active ? 'Deactivate' : 'Activate',
				value: item.active ? 'deactivate' : 'activate'
			},
			{ label: 'Delete this deployment', value: 'delete' }
		];

		return (
			<DropDownButton closeOnClick={true}>
				<ButtonList buttons={buttons}
					onButtonPress={(action: string) => this._onExchangeAction(item, action)}
				/>
			</DropDownButton>
		);
	}

	_onExchangeAction = (item: DBBotDeployment, action: string) => {
		if( action === 'activate' ){
			this.setState({loadingItems: {[item.id]: true}});
			apiCacher.updateDeployment(this.props.store.authenticatedId, item.id, {active: true})
				.then( () => {
					this.setState({loadingItems: {}});
				})
			;
		}
		else if (action === 'deactivate') {
			this.setState({ loadingItems: { [item.id]: true } });
			apiCacher.updateDeployment(this.props.store.authenticatedId, item.id, { active: false })
				.then(() => {
					this.setState({ loadingItems: {} });
				})
			;
		}
		console.log(item.id, action);
	}
}
