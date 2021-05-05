import * as React from 'react'
import styles from './_SidebarLayout.module.css';

interface SidebarLayoutProps {
	sidebar: React.ReactElement,
	sidebarWidth?: number,
	bgColor?: string
}

export default class SidebarLayout extends React.Component<SidebarLayoutProps> {
	render() {
		
		return (
			<div className={styles.container} style={{ backgroundColor: this.props.bgColor || '#011627' }}>
				<div className={styles.sidebarWrapper}
					style={{width: this.props.sidebarWidth || 250}}>
					{ this.props.sidebar }
				</div>
				<div className={styles.contentWrapper}>
					{ this.props.children }
				</div>
			</div>
		)
	}
}
