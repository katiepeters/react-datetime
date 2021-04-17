import * as React from 'react'
import EditorTab from '../../components/EditorTab';
import styles from './_BotEditorConsoleTab.module.css';

interface BotEditorConsoleTabProps {
	id: string
	active: boolean,
	onClick: (id:string) => void
}

export default class BotEditorConsoleTab extends React.Component<BotEditorConsoleTabProps> {
	render() {
		return (
			<EditorTab active={this.props.active} onClick={ this.props.onClick } id={this.props.id}>
				Console
			</EditorTab>
		)
	}
}
