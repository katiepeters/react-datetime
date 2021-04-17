import * as React from 'react'
import styles from './_BotEditorConsolePanel.module.css';

interface BotEditorConsolePanelProps {
	menu: React.ReactElement
}

export default class BotEditorConsolePanel extends React.Component<BotEditorConsolePanelProps> {
	render() {
		return (
			<div className={styles.container}>
				Console panel
			</div>
		)
	}
}
