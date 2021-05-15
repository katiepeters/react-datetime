import * as React from 'react'
import mergeStyles from '../../../../../utils/mergeStyles';
import styles from './_BotEditorConsolePanel.module.css';
import { DynamicList } from '../../../../../components';
import quickStore from '../../../../../state/quickStore';
import { ConsoleEntry } from '../../../../../../../lambdas/model.types';
import ConsolePanel from '../../../../../common/consolePanel/ConsolePanel';

interface BotEditorConsolePanelProps {
	quickStore: typeof quickStore
}

export default class BotEditorConsolePanel extends React.Component<BotEditorConsolePanelProps> {
	render() {
		const logs: ConsoleEntry[] = this.props.quickStore.getLogs();
		return (
			<ConsolePanel
				logs={ logs } />
		);
	}
}