import * as React from 'react'
import styles from './SidebarLayout.module.css';

interface SidebarLayoutProps {
	sidebar: React.ReactElement
}

export default class SidebarLayout extends React.Component<SidebarLayoutProps> {
	render() {
		return (
			<div className={styles.container}>
				<div className={styles.sidebarWrapper}>
					{ this.props.sidebar }
				</div>
				<div className={styles.contentWrapper}>
					{ this.props.children }
				</div>
			</div>
		)
	}
}
