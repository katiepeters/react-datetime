import memoizeOne from 'memoize-one';
import * as React from 'react'
import { getStats } from '../../../../common/deplotymentStats/statsCalculator';
import StatTable from '../../../../common/deplotymentStats/StatTable';
import { Card } from '../../../../components';
import { BtActive } from '../../../../utils/backtest/Bt.types'

interface BtStatsProps {
	bt: BtActive
}

export default class BtStats extends React.Component<BtStatsProps> {
	render() {
		console.log( this.props.bt );
		return (
			<div>
				<Card>
					 <StatTable
					 	columns={ this.getTableColumns() }
						currency={ this.getCurrency() } />
				</Card>
			</div>
		);
	}
	getTableColumns() {
		return columnsMemo( this.props.bt );
	}

	getCurrency() {
		return this.props.bt.data.deployment.symbols[0].split('/')[1];
	}
}

const columnsMemo = memoizeOne( (bt: BtActive) => {
	return [{
		id: bt.data.id,
		header: 'Backtest',
		stats: getStats( bt.data.deployment )
	}];
})
