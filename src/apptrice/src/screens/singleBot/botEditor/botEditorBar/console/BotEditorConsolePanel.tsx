import * as React from 'react'
import mergeStyles from '../../../../../utils/mergeStyles';
import styles from './_BotEditorConsolePanel.module.css';
import quickStore from '../../../../../state/quickStore';
import ConsolePanel from '../../../../../common/consolePanel/ConsolePanel';

interface BotEditorConsolePanelProps {
	quickStore: typeof quickStore
}

export default class BotEditorConsolePanel extends React.Component<BotEditorConsolePanelProps> {
	render() {
		const activeBt = this.props.quickStore.getActiveBt();
		const logs = activeBt ? activeBt.data.deployment.logs : [];
		return (
			<ConsolePanel
				logs={ logs } />
		);
	}
}