import React, { Component } from 'react'
import { DbBotVersion } from '../../../../../../../lambdas/model.types';

interface VersionPanelProps {
	version: DbBotVersion
}
export default class VersionPanel extends Component<VersionPanelProps> {

	render() {
		const {isLocked, number} = this.props.version;

		return (
			<div style={{padding: '10px'}}>
				<p>
					This editor is showin the version {number}.
				</p>
				{ this.renderLockedMessage(isLocked) }
				<p>
					Versions are updated automatically when the bot is deployed or backtested.
				</p>
			</div>
		);
	}

	renderLockedMessage(isLocked: boolean) { 
		if( isLocked ){
			return (
				<p>This version is locked because it has been already deployed. A new version will be created when the code is edited.</p>
			);
		}
	}
}
