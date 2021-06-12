import * as React from 'react'
import { ScreenProps } from '../../../types';
import styles from './_BotBtScreen.module.css';
import { ScreenWrapper, Tabs, Tab } from '../../../components';

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
			</div>
		)
	}

	renderNoBt(){
		return (
			<>Please run a back test</>
		);
	}

	getActiveTab() {
		return 'stats';
	}

	_onChangeTab = (nextTab: string) => {
		console.log( nextTab );
	}
}
