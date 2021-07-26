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
				{ this.renderVersion() }
			</EditorTab>
		);
	}

	renderVersion(){
		const version = this.props.version;
		return (
			<span>v{ version.number }</span>
		);
	}
}