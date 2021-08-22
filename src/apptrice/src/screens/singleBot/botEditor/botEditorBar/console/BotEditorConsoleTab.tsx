import * as React from 'react';
import { getActiveBt } from '../../../../../state/selectors/bt.selectors';
import EditorTab from '../../components/EditorTab';
import styles from './_BotEditorConsoleTab.module.css';

interface BotEditorConsoleTabProps {
	id: string
	active: boolean,
	onClick: (id:string) => void
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

	lastLogsCount: number = 0;
	componentDidUpdate(prevProps: BotEditorConsoleTabProps) {
		const bt = getActiveBt();
		const logs = bt ? bt.data.deployment.logs : [];

		const count = logs.length;
		if ( count !== this.lastLogsCount && !this.props.active  ){
			this.lastLogsCount = count;
			this.setState({ activity: true });
		}
		else if( this.state.activity && this.props.active ){
			this.setState({ activity: false });
		}
	}
}
