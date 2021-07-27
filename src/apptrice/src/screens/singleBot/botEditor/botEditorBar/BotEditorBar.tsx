import * as React from 'react'
import Button from '../../../../components/button/Button';
import { BacktestConfig } from '../../../../common/btSettings/BotTools';
import styles from './_BotEditorBar.module.css';
import BotEditorConsolePanel from './console/BotEditorConsolePanel';
import BotEditorConsoleTab from './console/BotEditorConsoleTab';
import ProblemsPanel from './problems/ProblemsPanel';
import ProblemsTab, { CodeProblem } from './problems/ProblemsTab';
import quickStore from '../../../../state/quickStore';
import { Modal, ModalBox } from '../../../../components';
import BtSettings from '../../../../common/btSettings/BtSettings';
import ProgressBar from '../../../../common/btSettings/ProgressBar';
import BotEditorBarResizer from './BotEditorBarResizer';
import VersionTab from './version/VersionTab';
import VersionPanel from './version/VersionPanel';
import { DbBotVersion } from '../../../../../../lambdas/model.types';
import { Console } from 'console';
import ConsolePanel from '../../../../common/consolePanel/ConsolePanel';

interface BotEditorBarProps {
	version: DbBotVersion,
	codeProblems: CodeProblem[],
	quickStore: typeof quickStore,
	currentBackTesting?: any,
	onRun: (config: BacktestConfig) => void,
	onAbort: () => void
	onHighlightLine: (line:number) => void
}

const panelComponents: { [any: string]: any } = {
	problems: ProblemsPanel,
	console: BotEditorConsolePanel
}

export default class BotEditorBar extends React.Component<BotEditorBarProps> {
	state = {
		currentTab: 'problems',
		btModalOpen: false
	}

	render() {
		return (
			<div className={styles.container}>
				<div className={styles.tabsBar}>
					<div className={styles.tabs}>
						{this.renderTabs()}
					</div>
					<div className={styles.resizer}>
						<BotEditorBarResizer />
					</div>
					<div className={styles.buttons}>
						{this.renderBt()}
					</div>
				</div>
				<div className={styles.panelBar}>
					{ this.renderPanel() }
				</div>
				{ this.renderBtModal() }
			</div>
		)
	}

	renderTabs(){
		const {version, codeProblems, quickStore} = this.props;
		
		return (
			<div className={styles.tabs}>
				<VersionTab
					id="version"
					active={ 'version' === this.state.currentTab }
					onClick={ this._onTabPress }
					version={ this.props.version } />
				<ProblemsTab
					id="problems"
					active={ 'problems' === this.state.currentTab }
					onClick={ this._onTabPress }
					problems={this.props.codeProblems } />
				<BotEditorConsoleTab
					id="console"
					active={ 'console' === this.state.currentTab }
					onClick={ this._onTabPress }
					quickStore={ this.props.quickStore } />
			</div>
		)
	}

	renderPanel(){
		const currentTab = this.state.currentTab;
		if( currentTab === 'version' ){
			return <VersionPanel version={ this.props.version } />
		}
		else if( currentTab === 'problems' ){
			return <ProblemsPanel problems={ this.props.codeProblems} />
		}
		const activeBt = this.props.quickStore.getActiveBt();

		return <ConsolePanel logs={activeBt?.data.deployment.logs || []} />;
	}

	renderBt() {
		return (
			<div>
				<div>
					{this.renderButton()}
				</div>
				<div>
					{this.renderProgress()}
				</div>
			</div>
		)
	}

	renderButton() {
		if (this.isBtRunning()) {
			return (
				<Button size="s" onClick={this._onAbortBT}>
					Abort
				</Button>
			);
		}
		return (
			<Button size="s" onClick={this._showBtModal}>
				Start backtesting
			</Button>
		)
	}

	renderProgress() {
		if (!this.isBtRunning()) return;

		const { currentBackTesting } = this.props;
		const progress = currentBackTesting.iteration / currentBackTesting.totalIterations * 100;
		return (
			<ProgressBar progress={progress} />
		);
	}

	renderBtModal() {
		return (
			<Modal open={this.state.btModalOpen} onClose={this._hideBtModal}>
				{ () => (
					<ModalBox>
						<BtSettings
							botId={ this.props.version.botId}
							isRunning={ this.isBtRunning() }
							onRun={ this._onStartPressed }
							onAbort={ this._onAbortBT } />
					</ModalBox>
				)}
			</Modal>
		)
	}


	updatePercentage(field: string, value: string) {
		if (value[value.length - 1] !== '%') {
			this.setState({ [field]: value + '%' });
		}
		else {
			this.setState({ [field]: value });
		}
	}


	isBtRunning(): boolean {
		return this.props.currentBackTesting?.status === 'running' || false;
	}

	_showBtModal = () => {
		this.setState({btModalOpen: true});
	}

	_hideBtModal = () => {
		this.setState({btModalOpen: false});
	}

	_onStartPressed = (config: BacktestConfig) => {
		this._hideBtModal();
		this.props.onRun( config );
	}

	_onAbortBT = () => {
		this.props.onAbort();
	}

	_onTabPress = ( currentTab:string ) => {
		this.setState({currentTab});
	}
}
