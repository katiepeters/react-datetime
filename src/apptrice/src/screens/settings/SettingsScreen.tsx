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
						value={ this.props.localStore.getApiUrl() }
						onChange={ this._onChange }>
						<option>http://localhost:3030/dev</option>
						<option>https://b682acd3ie.execute-api.eu-west-1.amazonaws.com/dev</option>
					</select>
				</InputGroup>
			</ScreenWrapper>
		);
	}

	_onChange = (e: any) => {
		localStore.setApiUrl( e.target.value );
		apiClient.initialize(e.target.value);
	}
}
