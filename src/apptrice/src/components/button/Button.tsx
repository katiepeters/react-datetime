import * as React from 'react'
import mergeStyles from '../../utils/mergeStyles'
import styles from './_Button.module.css'

interface ButtonProps {
	onClick?: (e: any) => void,
	color?: 'green',
	size?: 'm' | 's'
}

export default class Button extends React.Component<ButtonProps> {
	static defaultProps = {
		color: 'green',
		size: 'm'
	}

	render() {
		const {size, color, onClick} = this.props;
		let cn = mergeStyles(
			styles.container,
			styles[`size_${size}`],
			styles[`color_${color}`],
		)
		return (
			<button className={cn} onClick={ onClick }>
				{ this.props.children }
			</button>
		)
	}
}