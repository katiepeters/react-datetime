import * as React from 'react'
import { CSSTransition } from 'react-transition-group';
import mergeStyles from '../../utils/mergeStyles';
import styles from './_Toaster.module.css';

const classNames = {
	enter: styles.toastEnter,
	enterActive: styles.toastEnterActive,
	exit: styles.toastLeave,
	exitActive: styles.toastLeaveActive,
}

type ToastLevel = 'success' | 'warning' | 'error';

interface Toast {
	message: string,
	level: ToastLevel,
	closeTimeout: number
}

interface ToasterProps {
}

interface ToasterState {
	toast?: Toast
}

let singleton: Toaster;
export default class Toaster extends React.Component<ToasterProps, ToasterState> {
	constructor(props: ToasterProps){
		super(props);
		singleton = this;
	}

	state: ToasterState = {
	}

	render() {
		return (
			<div className={styles.toaster}>
				<CSSTransition
					in={this.state.toast ? true : false}
					timeout={400}
					unmountOnExit
					classNames={classNames}>
						{ this.renderToast() }
				</CSSTransition>
			</div>
		);
	}

	lastToast: any;
	renderToast() {
		const toast = singleton.lastToast;
		if( toast === undefined ) return;

		let cn = mergeStyles(
			styles.toast,
			styles[`toast_${toast.level}`]
		);

		return (
			<div className={cn}>
				{toast.message}
			</div>
		)
	}

	timeout:any;
	static show( message: string, level:ToastLevel = 'error', closeTimeout: number = 5000 ){
		singleton.lastToast = { message, level, closeTimeout };
		singleton.setState({
			toast: {message, level, closeTimeout}
		});

		if( singleton.timeout ){
			singleton.timeout = undefined;
			clearTimeout(singleton.timeout);
		}
		setTimeout( () => {
			singleton.timeout = undefined;
			singleton.setState({toast: undefined});
		}, closeTimeout);
	}
}
