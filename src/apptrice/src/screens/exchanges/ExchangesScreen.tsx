import * as React from 'react'
import { Button, ScreenWrapper, Table } from '../../components';
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
			<Table data={ data } />
		);
	}

	renderCreateButton() {
		return (
			<Button size="s">Link new exchange</Button>
		);
	}
}
