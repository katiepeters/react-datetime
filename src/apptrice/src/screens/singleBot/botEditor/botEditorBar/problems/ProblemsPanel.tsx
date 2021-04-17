import * as React from 'react'
import styles from './_ProblemsPanel.module.css';

interface ProblemsPanelProps {
	menu: React.ReactElement
}

export default class ProblemsPanel extends React.Component<ProblemsPanelProps> {
	render() {
		return (
			<div className={styles.container}>
				Problems panel
			</div>
		)
	}
}
