import * as React from 'react'
import styles from './_IconButton.module.css';

interface IconButtonProps {
	type: string,
	onPress?: (event: any ) => any,
	onPressDown?: (event: any) => any
}

export default class IconButton extends React.Component<IconButtonProps> {
	render() {
		return (
			<button className={styles.button}
				onClick={this.props.onPress}
				onMouseDown={this.props.onPressDown}>
				<i className={`fa ${this.props.type}`} />
			</button>
		);
	}
}
