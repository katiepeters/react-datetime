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
		if( this.getActiveMenuItem() === 'details' ){
			return this.renderDetailsSidebar();
		}
		return (
			<div className="sidebar">
				<h2>Backtesting</h2>
				<MenuLinkList
					items={ this.getMenuItems() }
					active={ this.getActiveMenuItem() } />
			</div>
		);
	}

	renderDetailsSidebar() {
		return (
			<div className="sidebar">
				<div>
					<a href={`#/backtesting/${this.getBotId()}`}>←</a> <h2>Backtesting</h2>
				</div>
				<MenuLinkList
					items={this.getDetailsMenuItems()}
					active={this.getActiveDetailsMenuItem()} />
			</div>
		)
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

	getDetailsMenuItems() {
		let { id, btid } = this.props.router.location.params;
		return  [
			{ id: 'stats', label: 'Stats', link: `#/backtesting/${id}/${btid}/stats` },
			{ id: 'orders', label: 'Orders', link: `#/backtesting/${id}/${btid}/orders` },
			{ id: 'charts', label: 'Charts', link: `#/backtesting/${id}/${btid}/charts` },
		]
	}

	getActiveDetailsMenuItem(){
		let { pathname } = this.props.router.location;
		if( pathname.includes('orders') ){
			return 'orders';
		}
		if( pathname.includes('charts') ){
			return 'charts';
		}
		return 'stats'
	}

	getSubscreen() {
		const {matches} = this.props.router.location;

		return matches[2] || matches[1] || BtSettingsScreen;
	}

	getBotId() {
		return this.props.router.location.params.id;
	}
}
