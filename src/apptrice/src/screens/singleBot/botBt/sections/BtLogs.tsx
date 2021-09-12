import * as React from 'react'
import { BtActive } from '../../../../utils/backtest/Bt.types';
import { Card } from '../../../../components';

interface BtLogsProps {
	bt: BtActive
}

export default class BtLogs extends React.Component<BtLogsProps> {
	render() {
		const {logs} = this.props.bt.data.deployment;

		return (
			<Card>
				<pre>{JSON.stringify(logs, null, 2)}</pre>
			</Card>
		)
	}
}
