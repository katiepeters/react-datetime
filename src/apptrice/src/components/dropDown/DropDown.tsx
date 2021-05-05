import * as React from 'react'
import { CSSTransition } from 'react-transition-group';
import ClickOut from '../clickOut/ClickOut';
import styles from './_DropDown.module.css';

interface DropDownProps {
	open?: boolean
	onClickOut?: () => any
	onClickIn?: () => any
	align?: 'right' | 'left'
}

const classNames = {
	enter: styles.containerEnter,
	enterActive: styles.containerEnterActive,
	exit: styles.containerLeave,
	exitActive: styles.containerLeaveActive,
}

export default class DropDown extends React.Component<DropDownProps> {
	state = {
		isOpen: this.props.open
	}

	render() {
		let st = {
			[ this.props.align || 'left']: 0 
		}
		return (
			<div className={styles.container} onClick={ this.props.onClickIn }>
				<CSSTransition
					in={this.isOpen()}
					timeout={200}
					unmountOnExit
					className={styles.container}
					classNames={classNames}>
					<ClickOut onClickout={this._onClickOut}>
						<div className={styles.panel} style={st}>
							{ this.props.children }
						</div>
					</ClickOut>
				</CSSTransition>
			</div>
		);
	}

	isOpen() {
		return this.props.open === true || this.state.isOpen;
	}

	_onClickOut = () => {
		if( this.isOpen() && this.props.onClickOut ){
			this.props.onClickOut();
		}
		if( !this.props.open && this.state.isOpen ){
			this.setState({isOpen: false});
		}
	}
}
