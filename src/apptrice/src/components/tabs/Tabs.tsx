import * as React from 'react'
import mergeStyles from '../../utils/mergeStyles';
import Tab from './Tab';
import styles from './_Tabs.module.css';

interface TabsProps {
	active: string
	onChange: (activeTabId: string) => void
	children: React.ReactElement<Tab>[]
}

export default class Tabs extends React.Component<TabsProps> {
	render() {
		return (
			<div className={styles.tabs}>
				{ this.props.children.map( (child: React.ReactElement<Tab>) => (
					this.renderTab( child )
				))}
			</div>
		);
	}

	renderTab(child: React.ReactElement<Tab> ){
		// @ts-ignore
		let {id} = child.props;
		return (
			<WrappedTab id={id}
				onClick={ () => this.props.onChange(id) }
				isActive={ this.props.active === id }>
				{ child }
			</WrappedTab>
		);
	}
}

interface WrappedTabProps {
	id: string
	onClick: (id: string) => any
	isActive: boolean
}

class WrappedTab extends React.Component<WrappedTabProps> {
	render() {
		const {isActive, onClick, id} = this.props;

		const cn = mergeStyles(
			styles.tabWrapper,
			isActive && styles.active
		);

		return (
			<div className={ cn } onClick={ () => onClick(id) }>
				{ this.props.children }
			</div>
		);
	}
}
