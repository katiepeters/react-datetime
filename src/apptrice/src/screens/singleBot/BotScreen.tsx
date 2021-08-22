import * as React from 'react'
import { ScreenProps } from '../../types'
import BotDetailsScreen from './botDetails/BotDetailsScreen'
import {SidebarLayout} from '../../components';
import AppMenu from '../../AppMenu';
import { botLoader } from '../../state/loaders/bot.loader';
import { getAuthenticatedId } from '../../state/selectors/account.selectors';

export default class BotScreen extends React.Component<ScreenProps> {
	render() {
		let Subscreen = this.getSubscreen();
		let {isLoading, data: bot} = botLoader({
			accountId: getAuthenticatedId(),
			botId: this.getBotId()
		});

		if( isLoading || !bot ){
			return <div>Loading...</div>;
		}

		return (
			<SidebarLayout
				sidebar={ this.renderMenu() }
				sidebarWidth={65}
				bgColor="#061725">
				<Subscreen {...this.props} bot={bot} />
			</SidebarLayout>
		);
	}

	renderMenu() {
		return (
			<AppMenu
				title="Bot"
				items={ this.getItems() }
				currentPath={ this.props.router.location.pathname } />
		);
	}

	getItems() {
		let id = this.props.router.location.params.id;

		return [
			{ name: 'Details', icon: 'percentage', link: `#/bots/${id}` },
			{ name: 'Editor', icon: 'code', link: `#/bots/${id}/editor` },
			{ name: 'Backtest', icon: 'chart-bar', link: `#/bots/${id}/backtesting` }
		]
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

	getBotId(): string {
		return this.props.router.location.params.id;
	}
}
