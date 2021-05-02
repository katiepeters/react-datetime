import * as React from 'react';
import { createPortal } from 'react-dom';
import {CSSTransition} from 'react-transition-group';
 
interface PortalProps {
	id: string,
	transitionName: string,
	transitionEnterTimeout: number,
	transitionLeaveTimeout: number,
	classNames: any
}

interface PortalState {
	showing: boolean
}

/**
 * This component make easier the usage of portals with animations
 */
export default class Portal extends React.Component<PortalProps, PortalState> {
	state = {
		showing: false
	}

	static defaultProps = {
		transitionEnterTimeout: 300,
		transitionLeaveTimeout: 300
	}

	render(){
		return createPortal( this.renderPortalContent(), getElement( this.props.id ) )
	}

	renderPortalContent() {
		return (
			<CSSTransition
				in={this.state.showing}
				timeout={300}
				classNames={this.props.classNames}>
					{this.props.children}
			</CSSTransition>
		);
	}

	componentDidMount() {
		this.setState({showing: true});
	}

	componentWillUnmount() {
		this.setState({showing: false});
		setTimeout( () => {
			getElement(this.props.id).innerHTML = '';
		}, this.props.transitionLeaveTimeout)
	}
}


function getElement( id: string ) {
	let el = document.getElementById(id);

	if (!el) {
		el = document.createElement('div');
		el.id = id;
		document.body.appendChild(el);
	}

	return el;
}

