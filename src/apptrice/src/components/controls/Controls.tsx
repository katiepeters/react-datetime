import * as React from 'react'
import mergeStyles from '../../utils/mergeStyles';
import styles from './_Controls.module.css';

interface ControlsProps {
	children: any[]
}

export default class Controls extends React.Component<ControlsProps> {
	render() {
		return (
			<div className={styles.container}>
				{ this.props.children.map( this._renderChild ) }
			</div>
		)
	}

	_renderChild = (child: any, i: number) => {
		let cn = mergeStyles(
			styles.item,
			i === 0 && styles.firstItem
		);

		return (
			<div key={`c${i}`} className={cn}>
				{child}
			</div>
		);
	}
}
