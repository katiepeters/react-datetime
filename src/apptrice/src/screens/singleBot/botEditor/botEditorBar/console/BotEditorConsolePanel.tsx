import * as React from 'react'
import mergeStyles from '../../../../../utils/mergeStyles';
import styles from './_BotEditorConsolePanel.module.css';
import { DynamicList } from '../../../../../components';
import quickStore from '../../../../../state/quickStore';
import { ConsoleEntry } from '../../../../../../../lambdas/model.types';

interface BotEditorConsolePanelProps {
	quickStore: typeof quickStore
}

export default class BotEditorConsolePanel extends React.Component<BotEditorConsolePanelProps> {
	state = {
		activity: false
	}

	render() {
		const logs: ConsoleEntry[] = this.props.quickStore.getLogs();
		
		if( !logs.length ){
			return this.renderNoLogs();
		} 

		return (
			<div className={styles.container}>
				<div className={styles.content}>
					{ logs.length ? this.renderLogs(logs) : 'No logs yet'}
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
				items={ logs }
				defaultSize={ 18 }
				renderItem={ this._renderLogLine } />
		);
	}

	_renderLogLine = (log: ConsoleEntry) => {
		return (
			<div className={styles.row}>
				<div className={mergeStyles(styles.date, styles[log.type])}>
					{ this.formatDate(log.date) }
				</div>
				<div id={`log${log.id}`} className={styles.message}>
					{ log.message }
				</div> 
			</div>
		);
	}

	formatDate( ts: number ){
		let d = (new Date(ts)).toISOString();
		return d.replace('T', ' ').split('.')[0].split(' ')[1];
	}
}