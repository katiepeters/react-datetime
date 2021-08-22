import * as React from 'react';
import { Lorese } from './Lorese';

export function LoreseConnector ( Comp: any, lorese: Lorese<any> ) {
	return class LoreseProvider extends React.Component {
		render(){
			return <Comp {...this.props} />;
		}

		componentDidMount(){
			lorese.addChangeListener( this._refresh );
		}
		componentWillUnmount(){
			lorese.removeChangeListener( this._refresh );
		}

		_refresh = () => {
			this.forceUpdate();
		}
	}
}
