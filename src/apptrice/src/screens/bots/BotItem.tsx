import * as React from 'react'
import {DbBot} from '../../state/apiCacher'

interface BotItemProps {
	bot: DbBot
}
export default class BotItem extends React.Component<BotItemProps> {
	render() {
		const { bot } = this.props;
		return (
			<a href={`#/bots/${bot.id}`}>
				{ bot.name }
			</a>
		);
	}
}
