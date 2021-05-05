import * as React from 'react'
import DropDown from '../dropDown/DropDown';
import IconButton from '../iconButton/IconButton';
import styles from './_DropDownButton.module.css';

interface DropDownButtonProps {
	open?: boolean,
	closeOnClick?: boolean
}

export default class DropDownButton extends React.Component<DropDownButtonProps> {
	state = {
		isOpen: false
	}

	render() {
		return (
			<div className={styles.container}>
				<IconButton type="fa-ellipsis-v"
					onPress={ this._openDropDown } />
				<DropDown
					align="right"
					open={ this.state.isOpen }
					onClickIn={ this._onClickIn }
					onClickOut={ this._closeDropDown }>
					{ this.props.children }
				</DropDown>
			</div>
		);
	}

	_openDropDown = () => {
		if( !this.state.isOpen ){
			this.setState({isOpen: true});
		}
	}

	_closeDropDown = () => {
		if (this.state.isOpen) {
			this.setState({ isOpen: false });
		}
	}

	_onClickIn = () => {
		if( this.props.closeOnClick ){
			this.setState({isOpen: false});
		}
	}
}
