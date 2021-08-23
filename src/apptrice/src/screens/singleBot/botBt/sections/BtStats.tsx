import memoizeOne from 'memoize-one';
import * as React from 'react'
import { getDeploymentAssets } from '../../../../../../lambdas/_common/utils/deploymentUtils';
import { getStats } from '../../../../common/deplotymentStats/statsCalculator';
import StatTable from '../../../../common/deplotymentStats/StatTable';
import { Card } from '../../../../components';
import { BtActive } from '../../../../utils/backtest/Bt.types'
import PortfolioHistoryWidget from '../../../singleDeployment/stats/widgets/PortfolioHistoryWidget';
import ReturnsWidget from '../../../singleDeployment/stats/widgets/ReturnsWidget';
import styles from './_BtStats.module.css';

interface BtStatsProps {
	bt: BtActive
}

export default class BtStats extends React.Component<BtStatsProps> {
	render() {
		const {deployment} = this.props.bt.data;
		return (
			<div className={styles.container}>
				<div className={styles.left}>
					<Card>
						<StatTable
							columns={ this.getTableColumns() }
							currency={ this.getCurrency() } />
					</Card>
				</div>
				<div className={styles.right}>
					<ReturnsWidget
						deployment={ deployment } />
					<PortfolioHistoryWidget
						deployment={ deployment } />
				</div>
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
