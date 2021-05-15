import * as React from 'react'
import { ConsoleEntry } from '../../../../lambdas/model.types';
import { DynamicList } from '../../components';
import mergeStyles from '../../utils/mergeStyles';
import styles from './_ConsolePanel.module.css';

interface ConsolePanelProps {
	logs: ConsoleEntry[]
}

export default class ConsolePanel extends React.Component<ConsolePanelProps> {
	render() {
		const {logs} = this.props;

		if (!logs.length) {
			return this.renderNoLogs();
		}

		return (
			<div className={styles.container}>
				<div className={styles.content}>
					{logs.length ? this.renderLogs(logs) : 'No logs yet'}
				</div>
			</div>
		);
	}

	renderNoLogs() {
		return (
			<div className={styles.container}>
				<div className={styles.content}>
					No logs yet.
				</div>
			</div>
		);
	}

	renderLogs(logs: ConsoleEntry[]) {
		return (
			<DynamicList
				items={logs}
				defaultSize={18}
				renderItem={this._renderLogLine} />
		);
	}

	_renderLogLine = (log: ConsoleEntry) => {
		return (
			<div className={styles.row}>
				<div className={mergeStyles(styles.date, styles[log.type])}>
					{this.formatDate(log.date)}
				</div>
				<div id={`log${log.id}`} className={styles.message}>
					{log.message}
				</div>
			</div>
		);
	}

	formatDate(ts: number) {
		let d = (new Date(ts)).toISOString();
		return d.replace('T', ' ').split('.')[0].split(' ')[1];
	}
}
