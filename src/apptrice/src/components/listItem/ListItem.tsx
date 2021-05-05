import * as React from 'react'
import { IconButton } from '..';
import styles from './_ListItem.module.css';

interface ListItemProps {
	onPress?: () => any
	title: string
	subtitle?: string
}

export default class ListItem extends React.Component<ListItemProps> {
	state = {
		showOptions: false
	}

	render() {
		return (
			<div className={styles.container} onClick={ this.props.onPress }>
				<div className={styles.pre}>
					<div className={styles.title}>
						{this.props.title}
					</div>
					{ this.renderSubtitle() }
				</div>
				<div className={styles.controls}>
				</div>
			</div>
		);
	}

	renderSubtitle() {
		if( this.props.subtitle ){
			return (
				<div className={styles.subtitle}>
					{this.props.subtitle}
				</div>
			);
		}
	}

	renderControls() {
	}

	renderOptions() {
		if( !this.state.showOptions ) return;
	}


}
