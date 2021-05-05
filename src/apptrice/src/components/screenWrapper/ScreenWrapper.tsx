import * as React from 'react'
import styles from './_ScreenWrapper.module.css';

interface ScreenWrapperProps {
	title: string
	titleExtra?: any
}

export default class ScreenWrapper extends React.Component<ScreenWrapperProps> {
	render() {
		return (
			<div className={styles.container}>
				<div className={styles.titleWrapper}>
					<h2 className={styles.title}>
						{this.props.title}
					</h2>
					{ this.props.titleExtra }
				</div>
				<div className={styles.content}>
					{ this.props.children }
				</div>
			</div>
		);
	}
}
