import React, { Component } from 'react'
import mergeStyles from '../../utils/mergeStyles';
import styles from './_MenuLinkList.module.css';

interface MenuLink  {
	id: string,
	label: string,
	link: string
}

interface MenuLinkListProps {
	active: string
	items: MenuLink[],
	backgroundColor?: string
	foregroundColor?: string
}

export default class MenuLinkList extends Component<MenuLinkListProps> {
	render() {
		return (
			<div style={{ backgroundColor: this.props.backgroundColor || '#082238'}}>
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

