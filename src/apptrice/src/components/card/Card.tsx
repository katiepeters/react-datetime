import * as React from 'react'
import mergeStyles from '../../utils/mergeStyles';
import styles from './_Card.module.css';

interface CardProps {
	color?: 'light' | 'dark' | 'red' | 'yellow' | 'blue'
}

export default class Card extends React.Component<CardProps> {
	render() {
		let { color = 'dark' } = this.props;
		let cn = mergeStyles(
			styles.container,
			styles[color]
		);

		return (
			<div className={cn}>
				{ this.props.children }
			</div>
		);
	}
}
