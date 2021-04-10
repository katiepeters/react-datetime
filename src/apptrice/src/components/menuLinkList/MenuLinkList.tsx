import React, { Component } from 'react'
import mergeStyles from '../../utils/mergeStyles';
import styles from './MenuLinkList.module.css';

interface MenuLink  {
	id: string,
	label: string,
	link: string
}

interface MenuLinkListProps {
	active: string
	items: MenuLink[]
}

export default class MenuLinkList extends Component<MenuLinkListProps> {
	render() {
		return (
			<div className={styles.container}>
				{ this.props.items.map( this._renderLink ) }
			</div>
		)
	}

	_renderLink = (item: MenuLink) => {
		let className = mergeStyles(
			styles.item,
			this.props.active === item.id && styles.itemActive
		);

		return (
			<a href={ item.link }
				className={className}>
				{item.label}
			</a>
		)
	}
}

