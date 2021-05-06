import * as React from 'react'
import styles from './_Spinner.module.css';

interface SpinnerProps {
	size?: number,
	color?: string
}

export default class Spinner extends React.Component<SpinnerProps> {
	render() {
		let size = this.props.size || 24;
		let color = this.props.color || '#d8a3fb';

		return (
			<div className={styles.container}>
				<i className={ `fa fa-clock ${styles.clock}` }
					style={{fontSize: size, color}} />
			</div>
		);
	}
}
