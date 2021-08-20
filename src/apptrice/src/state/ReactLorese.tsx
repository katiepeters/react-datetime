import * as React from 'react';
import { Lorese } from './Lorese';

interface LoreseProviderProps {
	lorese: Lorese<any>,
}

export class LoreseProvider extends React.Component<LoreseProviderProps> {
	render(){
		return this.props.children;
	}

	componentDidMount(){
		this.props.lorese.addChangeListener( this._refresh );
	}
	componentWillUnmount(){
		this.props.lorese.removeEventListener( this._refresh );
	}

	_refresh = () => {
		this.forceUpdate();
	}
}