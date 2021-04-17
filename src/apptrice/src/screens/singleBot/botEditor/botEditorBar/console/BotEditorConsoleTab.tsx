import * as React from 'react'
import styles from './_BotEditorConsoleTab.module.css';

interface BotEditorConsoleTabProps {
	menu: React.ReactElement
}

export default class BotEditorConsoleTab extends React.Component<BotEditorConsoleTabProps> {
	render() {
		return (
			<div className={styles.container}>
				Console
			</div>
		)
	}
}
