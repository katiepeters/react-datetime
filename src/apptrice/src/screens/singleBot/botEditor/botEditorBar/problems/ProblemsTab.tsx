import * as React from 'react'
import styles from './_ProblemsTab.module.css';

interface ProblemsTabProps {
	menu: React.ReactElement
}

export default class ProblemsTab extends React.Component<ProblemsTabProps> {
	render() {
		return (
			<div className={styles.container}>
				Problems
			</div>
		)
	}
}
