import * as React from 'react'
import { ScreenProps } from '../../types'
import BotDetailsScreen from './botDetails/BotDetailsScreen'
import {MenuLinkList, SidebarLayout} from '../../components';

export default class BotScreen extends React.Component<ScreenProps> {
	render() {
		let Subscreen = this.getSubscreen();

		return (
			<SidebarLayout sidebar={ this.renderMenu() }>
				<Subscreen {...this.props} />
			</SidebarLayout>
		);
	}

	renderMenu() {
		return (
			<div style={{ background: '#082238', flex: 1}}>
				<h2>Bot</h2>
				<MenuLinkList
					active={this.getActiveItem()}
					items={this.getMenuItems()} />
			</div>
		);
	}

	getSubscreen() {
		return this.props.router.location.matches[2] || BotDetailsScreen;
	}

	getMenuItems() {
		let botId = this.props.router.location.params.id;
		return [
			{ id: 'details', label: 'Details', link: `#/bots/${botId}/details` },
			{ id: 'editor', label: 'Editor', link: `#/bots/${botId}/editor` },
			{ id: 'backtesting', label: 'Backtesting', link: `#/backTesting/${botId}` },
		]
	}

	getActiveItem() {
		let [segment] = window.location.href.split('/').slice(-1);

		switch( segment ){
			case 'editor':
				return 'editor';
			case  'backtesting':
				return 'backtesting';
		}
		return 'details';
	}
}
