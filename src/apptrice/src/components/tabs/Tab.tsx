import * as React from 'react'
import styles from './_Tabs.module.css';

interface TabProps {
	id: string
}

export default class Tab extends React.Component<TabProps> {
	render() {
		return (
			<div className={styles.container}>
				{ this.props.children }
			</div>
		)
	}
}
