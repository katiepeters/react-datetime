import * as React from 'react'
import styles from './_Modal.module.css';
import { CSSTransition } from 'react-transition-group';
import { createPortal } from 'react-dom';

const classNames = {
	enter: styles.containerEnter,
	enterActive: styles.containerEnterActive,
	exit: styles.containerLeave,
	exitActive: styles.containerLeaveActive
}

interface ModalProps {
	open: boolean,
	children: () => JSX.Element
}

export default class Modal extends React.Component<ModalProps> {

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
			<div className={styles.container}>
				<div className={styles.content}>
					{this.props.children()}
				</div>
			</div>
		)
	}

	renderEmpty() {
		return <span style={{ display: 'none' }} />;
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

