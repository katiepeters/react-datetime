import * as React from 'react'
import { InputGroup, ScreenWrapper } from '../../components';
import apiClient from '../../state/apiClient';
import { getEnvironment } from '../../state/selectors/environment.selectors';
import { setEnvironment } from '../../state/updaters/environment.updater';
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
						value={ getEnvironment() }
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
		setEnvironment( e.target.value );
		apiClient.initialize(e.target.value);
		window.location.reload();
	}
}
