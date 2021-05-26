import * as React from 'react'
import { InputGroup, ScreenWrapper } from '../../components';
import apiClient from '../../state/apiClient';
import localStore from '../../state/localStore';
import { ScreenProps } from '../../types';

export default class SettingsScreen extends React.Component<ScreenProps> {
	state = {
		url: localStorage
	}

	render() {
		return (
			<ScreenWrapper title="Settings">
				<InputGroup
					name="api"
					label="API URL">
					<select
						value={ this.props.localStore.getEnvironment() }
						onChange={ this._onChange }>
						<option value="local">
							Local
						</option>
						<option value="awsTest">
							AWS test
						</option>
					</select>
				</InputGroup>
			</ScreenWrapper>
		);
	}

	_onChange = (e: any) => {
		localStore.setEnvironment( e.target.value );
		apiClient.initialize(e.target.value);
		window.location.reload();
	}
}
