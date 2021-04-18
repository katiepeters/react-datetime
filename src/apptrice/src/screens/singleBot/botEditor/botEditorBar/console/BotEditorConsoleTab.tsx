import * as React from 'react'
import { ConsoleEntry } from '../../../../../../../lambdas/executor/Consoler';
import EditorTab from '../../components/EditorTab';
import styles from './_BotEditorConsoleTab.module.css';

interface BotEditorConsoleTabProps {
	id: string
	active: boolean,
	onClick: (id:string) => void
	backtesting: any
}

export default class BotEditorConsoleTab extends React.Component<BotEditorConsoleTabProps> {
	state = {
		activity: false
	}

	render() {
		return (
			<EditorTab active={this.props.active} onClick={ this.props.onClick } id={this.props.id}>
				Console {this.renderActivity()}
			</EditorTab>
		)
	}

	renderActivity() {
		if( this.state.activity ){
			return <i className={`fas fa-circle ${styles.activityDot}`}></i>
		}
	}

	componentDidUpdate(prevProps: BotEditorConsoleTabProps) {
		if (prevProps.backtesting?.logs !== this.props.backtesting?.logs && !this.props.active ) {
			this.setState({ activity: true });
		}
		else if( this.state.activity && this.props.active ){
			this.setState({ activity: false });
		}
	}
}
