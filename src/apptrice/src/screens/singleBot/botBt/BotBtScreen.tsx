import * as React from 'react'
import { ScreenProps } from '../../../types';
import styles from './_BotBtScreen.module.css';
import { ScreenWrapper, Tabs, Tab } from '../../../components';
import BtStats from './sections/BtStats';
import { BtActive } from '../../../utils/backtest/Bt.types';

export default class BotBtScreen extends React.Component<ScreenProps> {
	render() {
		return (
			<ScreenWrapper title="Backtest">
				{ this.renderContent() }
			</ScreenWrapper>
		)
	}

	renderContent() {
		const activeBt = this.props.quickStore.getActiveBt();
		if( !activeBt ) return this.renderNoBt();

		return (
			<div className={styles.container}>
				<div className={styles.tabs}>
					<Tabs active={this.getActiveTab()}
						onChange={ this._onChangeTab }>
						<Tab id="stats">Stats</Tab>
						<Tab id="charts">Charts</Tab>
						<Tab id="orders">Orders</Tab>
						<Tab id="state">State</Tab>
						<Tab id="logs">Logs</Tab>
					</Tabs>
				</div>
				<div className={styles.subscreen}>
					{ this.renderSubscreen(activeBt) }
				</div>
			</div>
		)
	}

	renderNoBt(){
		return (
			<>Please run a back test</>
		);
	}

	renderSubscreen(activeBt: BtActive) {
		const Screen = this.props.router.location.matches[3] || BtStats;
		return (
			<Screen
				{ ...this.props }
				bt={ activeBt } />
		);
	}

	getActiveTab() {
		let {location} = this.props.router;
		return location.pathname.split('/')[4] || 'stats';
	}

	_onChangeTab = (nextTab: string) => {
		const {router} = this.props;
		const url = `/bots/${router.location.params.id}/backtesting/${nextTab}`;
		router.push( url );
	}
}
