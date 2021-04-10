import * as React from 'react'
import { ScreenProps } from '../../types'
import BotList from './BotList'

export default class BotListScreen extends React.Component<ScreenProps> {
	render() {
		let Subscreen = this.getSubscreen();
		if (Subscreen) {
			return <Subscreen {...this.props} />;
		}

		return (
			<div>
				<div>
					<h1>Bots</h1>
					<button>Create new bot</button>
				</div>
				<div>
					<BotList accountId={this.props.store.authenticatedId} />
				</div>
			</div>
		)
	}

	getSubscreen(){
		return this.props.router.location.matches[1];
	}
}
