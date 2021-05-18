import * as React from 'react'
import { ScreenProps } from '../../types'
import BtRunner from '../../utils/BtRunner';
import botLoader from '../botEditor/bot.loader';
import BootTools, { BacktestConfig } from '../botEditor/tools/BotTools';

export default class BtDetailsScreen extends React.Component<ScreenProps> {
	render() {
		return (
			<div>
				<BootTools
					onRun={this._onRunBt}
					onAbort={this._onAbortBt}
					currentBackTesting={this.props.store.currentBackTesting} />
			</div>
		)
	}

	_onRunBt = (config: BacktestConfig) => {
		const botId = this.getBotId();
		let { data } = botLoader.getData(botId);
		let botData = {
			botId,
			source: data?.code
		};

		let btid = BtRunner.start(botData, config);
		this.props.router.push(`/backtesting/${botId}/${btid}/orders`);
	}

	_onAbortBt = () => {
		BtRunner.abort();
	}

	getBotId(): string {
		return this.props.router.location.params.id;
	}
}
