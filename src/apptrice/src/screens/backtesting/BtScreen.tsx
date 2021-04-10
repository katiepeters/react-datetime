import * as React from 'react'
import { MenuLinkList, SidebarLayout } from '../../components';
import { ScreenProps } from '../../types';
import BtSettingsScreen from './BtSettingsScreen';
import styles from './BtScreen.module.css';
import botLoader from '../botEditor/bot.loader';

export default class BtScreen extends React.Component<ScreenProps> {

	render() {
		let Subscreen = this.getSubscreen();
		let {isLoading, error} = botLoader.getData(this, this.getBotId());

		if( isLoading ){
			return 'Loading...';
		}

		if( error ){
			return 'Error getting the bot.';
		}

		return (
			<SidebarLayout sidebar={this.renderSidebar()}>
				<Subscreen {...this.props} />
			</SidebarLayout>
		);
	}

	renderSidebar() {
		return (
			<div className="sidebar">
				<h2>Backtesting</h2>
				<MenuLinkList
					items={ this.getMenuItems() }
					active={ this.getActiveMenuItem() } />
			</div>
		);
	}

	getMenuItems() {
		let botId = this.getBotId();
		let items = [
			{ id: 'run', label: 'Run backtesting', link: `#/backtesting/${botId}/settings` }
		];
		let bt = this.props.store.currentBackTesting;

		if( bt ){
			items.push({
				id: 'details', label: 'Details', link: `#/backtesting/${botId}/${bt.id}`
			});
		}

		return items;
	}

	getActiveMenuItem() {
		let { btid } = this.props.router.location.params;
		return btid ? 'details' : 'run';
	}

	getSubscreen() {
		return this.props.router.location.matches[1] || BtSettingsScreen;
	}

	getBotId() {
		return this.props.router.location.params.id;
	}
}
