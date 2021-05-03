import * as React from 'react'
import styles from './_Modal.module.css';
import { CSSTransition } from 'react-transition-group';
import { createPortal } from 'react-dom';

const classNames = {
	enter: styles.containerEnter,
	enterActive: styles.containerEnterActive,
	exit: styles.containerLeave,
	exitActive: styles.containerLeaveActive,
}

interface ModalProps {
	open: boolean,
	children: () => JSX.Element
	closeable?: boolean
	onClose?: () => any
}

export default class Modal extends React.Component<ModalProps> {
	container = React.createRef<HTMLDivElement>();

	static defaultProps = {
		closeable: true,
		onClose: (event: any) => console.warn('onClose not defined for modalBox')
	}

	render() {
		return createPortal(this.renderPortalContent(), getElement())	
	}

	renderPortalContent() {
		return (
			<CSSTransition
				in={this.props.open}
				timeout={300}
				unmountOnExit
				classNames={classNames}>
				{ this.renderContent() }
			</CSSTransition>
		);
	}

	renderContent() {
		return (
			<div className={styles.container}
				onClick={ this._checkClose }
				ref={ this.container }>
				<div className={styles.content}>
					{ this.renderChildrenWithProps() }
				</div>
			</div>
		)
	}

	renderChildrenWithProps() {
		const { closeable, onClose, open, children } = this.props;
		return React.cloneElement( children(), {closeable, onClose, open} );
	}

	renderEmpty() {
		return <span style={{ display: 'none' }} />;
	}

	_checkClose = (e: React.MouseEvent<HTMLDivElement> ) => {
		if( this.props.closeable && e.target === this.container.current ){
			// @ts-ignore
			this.props.onClose();
		}
	}

	scrollLocked = false;
	lockScroll() {
		this.scrollLocked = true;
		document.body.style.setProperty('overflow', 'hidden');
	}
	unlockScroll() {
		this.scrollLocked = false;
		setTimeout(() => {
			document.body.style.setProperty('overflow', 'auto');
		}, 300);
	}
	componentDidMount() {
		if( this.props.open ){
			this.lockScroll();
		}
	}
	componentDidUpdate() {
		this.checkScrollLock();
	}
	checkScrollLock(){
		if( this.props.open && !this.scrollLocked ){
			this.lockScroll();
		}
		else if( !this.props.open && this.scrollLocked ){
			this.unlockScroll();
		}
	}
	componentWillUnmount() {
		this.scrollLocked && this.unlockScroll();
	}
}


const MODAL_ID = 'modalContainer';
function getElement() {
	let el = document.getElementById(MODAL_ID);

	if (!el) {
		el = document.createElement('div');
		el.id = MODAL_ID;
		document.body.appendChild(el);
	}

	return el;
}

