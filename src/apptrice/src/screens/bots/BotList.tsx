import React, { Component } from 'react'
import botListLoader from './botList.loader';
import { DbBot } from '../../state/apiCacher'
import BotItem from './BotItem';

interface BotListProps {
	accountId: string
}

export default class BotList extends Component<BotListProps> {
	render() {
		const {accountId} = this.props;
		const {isLoading, data} = botListLoader.getData( this, accountId );
		if( isLoading || !data ){
			return <span>Loading...</span>;
		}

		if( !data.length ){
			return <span>No bots created yet</span>;
		}

		return (
			<div>
				{ data.map( this._renderBot ) }
			</div>
		)
	}

	_renderBot = (bot:DbBot) => {
		return (
			<BotItem key={bot.id} bot={bot} />
		);
	}
}
