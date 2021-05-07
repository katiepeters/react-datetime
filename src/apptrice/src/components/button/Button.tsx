import * as React from 'react'
import { Spinner } from '..';
import mergeStyles from '../../utils/mergeStyles'
import styles from './_Button.module.css'

interface ButtonProps {
	onClick?: (e: any) => void,
	color?: 'green' | 'transparent',
	size?: 'm' | 's',
	loading?: boolean,
	disabled?: boolean
}

export default class Button extends React.Component<ButtonProps> {
	static defaultProps = {
		color: 'green',
		size: 'm'
	}

	render() {
		const {size, color, disabled, loading} = this.props;
		let cn = mergeStyles(
			styles.container,
			styles[`size_${size}`],
			styles[`color_${color}`],
			(disabled || loading) && styles.container_disabled
		);

		let hoverCn = mergeStyles(
			styles.hoverLayer,
			styles[`hoverLayer_${color}`],
			(disabled || loading) && styles.hoverLayer_disabled
		);

		let contentCn = mergeStyles(
			styles.content,
			loading && styles.content_loading,
			disabled && styles.content_disabled
		);

		return (
			<button className={cn} onClick={ this._onClick } disabled={this.props.disabled}>
				<div className={hoverCn} />
				<div className={contentCn}>
					{this.props.children}
				</div>
				{ this.renderSpinner() }
			</button>
		);
	}

	renderSpinner() {
		if( this.props.loading ){
			return (
				<div className={styles.spinner}>
					<Spinner color="#fff" size={18} />
				</div>
			);
		}
	}

	_onClick = (e:any) => {
		const {disabled, loading, onClick} = this.props;
		if( !disabled && !loading && onClick ){
			onClick(e);
		}
	}
}