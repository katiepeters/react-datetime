import * as React from 'react'
import { BtActive } from '../../../../utils/backtest/Bt.types'

interface BtStatsProps {
	bt: BtActive
}

export default class BtStats extends React.Component<BtStatsProps> {
	render() {
		console.log( this.props.bt );
		return (
			<div>
				Stats
			</div>
		)
	}
}
