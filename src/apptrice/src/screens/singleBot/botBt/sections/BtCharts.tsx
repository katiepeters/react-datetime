import * as React from 'react'
import DeploymentCharts from '../../../../common/charts/DeploymentCharts';
import { ScreenProps } from '../../../../types'
import { BtActive } from '../../../../utils/backtest/Bt.types';

interface BtChartsProps extends ScreenProps {
	bt: BtActive
}

export default class BtCharts extends React.Component<BtChartsProps> {
	render() {
		let { exchange, deployment } = this.props.bt.data;
		return (
			<div>
				<DeploymentCharts
					selector="dropdown"
					exchangeProvider={ exchange.provider }
					deployment={ deployment } />
			</div>
		)
	}
}
