import React, { Component } from 'react'
import mergeStyles from '../../../utils/mergeStyles'
import styles from './_BtMenu.module.css';

interface BtMenuProps {
	active: string
	botId: string
}

export default class BtMenu extends Component<BtMenuProps> {
	render() {
		return (
			<div>
				{ this.renderLink('orders', 'Orders')}
				{ this.renderLink('charts', 'Charts')}
			</div>
		)
	}

	renderLink( sectionId: string, label: string ){
		let className = mergeStyles(
			styles.item,
			this.props.active === sectionId && styles.itemActive
		);

		return (
			<a href={`#/backtesting/${this.props.botId}/${sectionId}`}
				className={ className }>
				{label}
			</a>
		)
	}

	getLink( sectionId: string ){
		return `#/backtesting/${this.props.botId}/${sectionId}`;
	}
}

