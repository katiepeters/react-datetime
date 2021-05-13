import * as React from 'react'
import mergeStyles from './utils/mergeStyles';
import styles from './_AppMenu.module.css';

interface AppMenuItem {
	name: string
	icon: string
	link: string
}
interface AppMenuProps {
	currentPath: string,
	items: AppMenuItem[],
	title: string
	primary?: boolean
}

export default class AppMenu extends React.Component<AppMenuProps> {
	render() {
		const {primary} = this.props;

		let containerCn = mergeStyles(
			styles.container,
			primary && styles.container_primary
		);

		let titleCn = mergeStyles(
			styles.title,
			primary && styles.title_primary
		);

		return (
			<div className={containerCn}>
				<h2 className={titleCn}>{ this.props.title }</h2>
				<div className={styles.links}>
					{ this.props.items.map( item => (
						<AppLink name={item.name}
							icon={ item.icon }
							link={ item.link }
							isActive={this.isActive(item.link.slice(1))}
							primary={primary || false} />
					))}
				</div>
			</div>
		)
	}

	isActive( id: string ){
		return this.props.currentPath.startsWith(id);
	}
}


interface AppLinkProps {
	name: string
	icon: string
	link: string
	isActive: boolean
	primary: boolean
}

class AppLink extends React.Component<AppLinkProps> {
	render() {
		const {primary} = this.props;
		let linkCn = mergeStyles(
			styles.link,
			this.props.isActive && styles.linkActive,
			primary && styles.link_primary
		);

		let iconCn = mergeStyles(
			styles.icon,
			primary && styles.icon_primary
		)

		return (
			<a className={linkCn} href={this.props.link}>
				<span className={`fa fa-${this.props.icon} ${iconCn}`} />
				<div className={styles.linkTitle}>
					{ this.props.name }
				</div>
			</a>
		)
	}
}