import * as React from 'react'
// import styles from './_BotEditorConsolePanel.module.css';
import ConsolePanel from '../../../../../common/consolePanel/ConsolePanel';
import { getActiveBt } from '../../../../../state/selectors/bt.selectors';


export default class BotEditorConsolePanel extends React.Component {
	render() {
		const activeBt = getActiveBt();
		const logs = activeBt ? activeBt.data.deployment.logs : [];
		return (
			<ConsolePanel
				logs={ logs } />
		);
	}
}