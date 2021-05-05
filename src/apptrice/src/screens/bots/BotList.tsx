import React, { Component } from 'react'
import botListLoader from './botList.loader';
import { DbBot } from '../../state/apiCacher';
import { Table } from '../../components';
import { TableColumn } from '../../components/table/Table';

interface BotListProps {
	accountId: string,
	onBotClick: (bot: DbBot ) => any
}

export default class BotList extends Component<BotListProps> {
	render() {
		const {accountId} = this.props;
		const {isLoading, data} = botListLoader.getData( this, accountId );
		if( isLoading || !data ){
			return <span>Loading...</span>;
		}

		return (
			<Table
				data={ data }
				keyField="id"
				columns={ this.getColumns() }
				onRowClick={this.props.onBotClick}
			/>
		);
	}

	getColumns(): TableColumn<DbBot>[] {
		return [
			{ field: 'name', title: 'Bot name'},
			{ field: 'accountId', title: 'Account'}
		]
	}
}
