import * as React from 'react'
import { ExchangeAccountResponse } from '../../../../lambdas/model.types';
import { Button, ButtonList, DropDownButton, ScreenWrapper, Table } from '../../components';
import { TableColumn } from '../../components/table/Table';
import exchangeListLoader from '../../state/loaders/exchangeList.loader';
import { ScreenProps } from '../../types';
import styles from './_ExchangesScreen.module.css';

export default class ExchangesScreen extends React.Component<ScreenProps> {
	render() {
		let { data, isLoading, error } = exchangeListLoader.getData(this, this.props.store.authenticatedId);
		return (
			<ScreenWrapper title="API accounts" titleExtra={ this.renderCreateButton() }>
				{ data ? this.renderList(data) : 'Loading...' }
			</ScreenWrapper>
		);
	}

	renderList(data: any) {
		return (
			<Table data={ data } columns={ this.getColumns() } />
		);
	}

	renderCreateButton() {
		return (
			<Button size="s">Link new exchange</Button>
		);
	}

	getColumns(): TableColumn<ExchangeAccountResponse>[] {
		return [
			{field: 'id'},
			{field: 'provider'},
			{field: 'type'},
			{field: 'controls', title: '', renderFn: this._renderControls, noSort: true }
		];
	}

	_renderControls = (item: ExchangeAccountResponse) => {
		let buttons = [
			{label: 'Delete this exchange', value: 'delete'}
		];

		return (
			<DropDownButton closeOnClick={true}>
				<ButtonList buttons={buttons}
					onButtonPress={ (action: string) => this._onExchangeAction(item, action) }
				/>
			</DropDownButton>
		);
	}

	_onExchangeAction = (item: ExchangeAccountResponse, action: string) => {
		console.log( item.id, action );
	}
}
