import * as React from 'react'
import { DbBotVersion } from '../../../../../../../lambdas/model.types';
import EditorTab from '../../components/EditorTab';

interface VersionTabProps {
	id: string
	active: boolean
	onClick: (id: string) => void
	version: DbBotVersion
}

export default class VersionTab extends React.Component<VersionTabProps> {
	render() {
		return (
			<EditorTab active={this.props.active} onClick={ this.props.onClick } id={this.props.id}>
				{ this.renderLock() }
				{ this.renderVersion() }
			</EditorTab>
		);
	}

	renderLock(){
		const {version} = this.props;
		if( !version.isLocked ) return;

		return(
			<span style={{marginRight: 4, fontSize: 12}}>
				<i className="fas fa-lock"></i>
			</span>
		)
	}

	renderVersion(){
		const version = this.props.version;
		return (
			<span>v{ version.number }</span>
		);
	}
}