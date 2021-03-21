import * as React from 'react'
import { ScreenProps } from '../../types'
import BotList from './BotList'

export default class BotListScreen extends React.Component<ScreenProps> {
	render() {
		return (
			<div>
				<div>
					<h1>Bots</h1>
					<button>Create new bot</button>
				</div>
				<div>
					<BotList accountId={ this.props.store.authenticatedId } />
				</div>
			</div>
		)
	}
}
