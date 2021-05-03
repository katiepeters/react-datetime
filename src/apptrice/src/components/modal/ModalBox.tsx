import * as React from 'react'
import styles from './_Modal.module.css';
import IconButton from '../iconButton/IconButton';

interface ModalBoxProps {
	closeable?: boolean,
	onClose?: (event: any) => any
}

export default class ModalBox extends React.Component<ModalBoxProps> {
	static defaultProps = {
		closeable: true,
		onClose: (event: any) => console.warn('onClose not defined for modalBox')
	}

	render() {
		return (
			<div className={styles.box}>
				{ this.renderCloseButton() }
				{ this.props.children }
			</div>
		)
	}

	renderCloseButton(){
		if( !this.props.closeable ) return;
		return (
			<div className={styles.closeContainer}>
				<IconButton type="fa-times"
					onPress={ this.props.onClose } />
			</div>
		)
	}
}
