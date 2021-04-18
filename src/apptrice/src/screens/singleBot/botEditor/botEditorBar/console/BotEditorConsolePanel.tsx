import * as React from 'react'
import { ConsoleEntry } from '../../../../../../../lambdas/executor/Consoler';
import mergeStyles from '../../../../../utils/mergeStyles';
import styles from './_BotEditorConsolePanel.module.css';

interface BotEditorConsolePanelProps {
	backtesting: any
}

export default class BotEditorConsolePanel extends React.Component<BotEditorConsolePanelProps> {
	state = {
		activity: false
	}

	render() {
		const logs: ConsoleEntry[] = this.props.backtesting?.logs || [];
		if( !logs.length ){
			return this.renderNoLogs();
		} 

		return (
			<div className={styles.container}>
				<div className={styles.content}>
					{ logs.length ? logs.map( this._renderLogLine ) : 'No logs yet'}
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

	_renderLogLine = (log: ConsoleEntry) => {
		return (
			<tr key={log.date} className={styles.line}>
				<td className={mergeStyles(styles.date, styles[log.type])}>{ this.formatDate(log.date) }</td>
				<td>{ log.message }</td> 
			</tr>
		);
	}

	formatDate( ts: number ){
		let d = (new Date(ts)).toISOString();
		return d.replace('T', ' ').split('.')[0];
	}
}
