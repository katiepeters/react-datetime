import * as React from 'react'
import {DbBot} from '../../state/apiCacher'

interface BotItemProps {
	bot: DbBot
}
export default class BotItem extends React.Component<BotItemProps> {
	render() {
		const { bot } = this.props;
		return (
			<a href={`#/botEditor/${bot.id}`}>
				{ bot.name }
			</a>
		);
	}
}
