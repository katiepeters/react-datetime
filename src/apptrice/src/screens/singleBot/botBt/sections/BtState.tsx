import * as React from 'react'
import { BtActive } from '../../../../utils/backtest/Bt.types';
import { Card } from '../../../../components';

interface BtStateProps {
	bt: BtActive
}

export default class BtState extends React.Component<BtStateProps> {
	render() {
		const {state} = this.props.bt.data.deployment;

		return (
			<Card>
				<pre>{JSON.stringify(state, null, 2)}</pre>
			</Card>
		)
	}
}
