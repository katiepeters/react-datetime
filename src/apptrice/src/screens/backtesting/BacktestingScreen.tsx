import * as React from 'react'
import { ScreenProps } from '../../types';
import BtRunner from '../../utils/BtRunner';
import botLoader from '../botEditor/bot.loader';
import BootTools, { BacktestConfig }  from '../botEditor/tools/BotTools';
import BtOrdersSection from './btOrders/BtOrdersSection';

export default class BacktestingScreen extends React.Component<ScreenProps> {
	render() {
		const botId = this.getBotId(this.props);
		const { isLoading, data } = botLoader.getData(this, botId);

		if ( isLoading || !data) {
			return <span>Loading</span>;
		}

		return (
			<div style={styles.wrapper}>
				<div style={styles.menu}>
					<div style={{ marginBottom: 10 }}>
						<h2>Backtesting</h2>
					</div>
					<BootTools
						onRun={this._onRunBt}
						onAbort={this._onAbortBt}
						currentBackTesting={this.props.store.currentBackTesting} />
				</div>
				<div style={styles.content}>
					<BtOrdersSection
						currentBackTesting={ this.props.store.currentBackTesting } />
				</div>
			</div>
		)
	}

	_onRunBt = (config: BacktestConfig) => {
		let {data} = botLoader.getData(this, this.getBotId(this.props));
		let botData = {
			botId: this.getBotId(this.props),
			source: data?.code
		};
		BtRunner.start(botData, config);
	}

	_onAbortBt = () => {
		BtRunner.abort();
	}

	getBotId(props: ScreenProps): string {
		return props.router.location.params.id;
	}

}




const styles: { [id: string]: React.CSSProperties } = {
	wrapper: {
		display: 'flex',
		flexGrow: 1
	},
	menu: {
		display: 'flex',
		flexDirection: 'column',
		width: 240,
		background: '#233543',
		flexShrink: 0
	},
	content: {
		display: 'flex',
		flex: 1,
		background: '#324350'
	}
}