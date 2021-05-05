import * as React from 'react'
import { Button, ScreenWrapper } from '../../components';
import { DbBot } from '../../state/apiCacher';
import { ScreenProps } from '../../types'
import BotList from './BotList';
import styles from './_BotListScreen.module.css';

export default class BotListScreen extends React.Component<ScreenProps> {
	render() {
		let Subscreen = this.getSubscreen();
		if (Subscreen) {
			return <Subscreen {...this.props} />;
		}

		return (
			<ScreenWrapper title="Bots"
				titleExtra={ <Button size="s">Create new bot</Button> }>
					<BotList
						accountId={this.props.store.authenticatedId}
						onBotClick={this._navigateToBot } />
			</ScreenWrapper>
		);
	}

	getSubscreen(){
		return this.props.router.location.matches[1];
	}

	_navigateToBot = ( bot: DbBot ) => {
		this.props.router.push(`/bots/${bot.id}`);
	}
}
