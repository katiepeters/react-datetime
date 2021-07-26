import React, { Component } from 'react'
import BotEditorLayoutContext from '../BotEditorLayoutContext'

export default class BotEditorBarResizer extends Component {
	static contextType = BotEditorLayoutContext;
	render() {
		return (
			<div { ...this.context.bottomHandlers } style={{ width: '100%'}} />
		)
	}
}
