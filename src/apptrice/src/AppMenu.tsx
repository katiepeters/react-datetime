import * as React from 'react'
import mergeStyles from './utils/mergeStyles';
import styles from './_AppMenu.module.css';

interface AppMenuProps {
	currentPath: string
}

export default class AppMenu extends React.Component<AppMenuProps> {
	render() {
		return (
			<div className={styles.container}>
				<h2 className={styles.title}>TradingBots</h2>
				<div className={styles.links}>
					<AppLink name="Deploys" icon="rocket" link="#/deployments" isActive={this.isActive('deployments')} />
					<AppLink name="Bots" icon="robot" link="#/bots" isActive={this.isActive('bots')} />
					<AppLink name="API accounts" icon="plug" link="#/exchanges" isActive={this.isActive('exchanges')} />
					<AppLink name="Settings" icon="cogs" link="#/settings" isActive={this.isActive('settings')} />
				</div>
			</div>
		)
	}

	isActive( id: string ){
		return this.props.currentPath.startsWith(`/${id}`);
	}
}


interface AppLinkProps {
	name: string
	icon: string
	link: string
	isActive: boolean
}

class AppLink extends React.Component<AppLinkProps> {
	render() {
		let st = mergeStyles(
			styles.link,
			this.props.isActive && styles.linkActive
		);

		return (
			<a className={st} href={this.props.link}>
				<span className={`fa fa-${this.props.icon} ${styles.linkIcon}`} />
				<div className={styles.linkTitle}>
					{ this.props.name }
				</div>
			</a>
		)
	}
}