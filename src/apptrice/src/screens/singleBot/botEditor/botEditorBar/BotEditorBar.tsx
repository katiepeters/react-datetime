import * as React from 'react'
import Button from '../../../../components/button/Button';
import { BacktestConfig } from '../../../../common/btSettings/BotTools';
import styles from './_BotEditorBar.module.css';
import BotEditorConsoleTab from './console/BotEditorConsoleTab';
import ProblemsPanel from './problems/ProblemsPanel';
import ProblemsTab, { CodeProblem } from './problems/ProblemsTab';
import { Modal, ModalBox } from '../../../../components';
import BtSettings from '../../../../common/btSettings/BtSettings';
import ProgressBar from '../../../../common/btSettings/ProgressBar';
import BotEditorBarResizer from './BotEditorBarResizer';
import VersionTab from './version/VersionTab';
import VersionPanel from './version/VersionPanel';
import ConsolePanel from '../../../../common/consolePanel/ConsolePanel';
import { StoreBotVersion } from '../../../../state/stateManager';
import { getActiveBt } from '../../../../state/selectors/bt.selectors';

interface BotEditorBarProps {
	version: StoreBotVersion,
	codeProblems: CodeProblem[],
	onRun: (config: BacktestConfig) => void,
	onAbort: () => void
	onHighlightLine: (line:number) => void
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
					onClick={ this._onTabPress } />
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
		const activeBt = getActiveBt();
		const logs = activeBt ?
			activeBt.data.deployment.logs : 
			[]
		;

		return <ConsolePanel logs={logs} />;
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
		const activeBt = getActiveBt()
		const progress = activeBt ?
			activeBt.currentIteration / activeBt.totalIterations * 100 : 
			0
		;

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
		const bt = getActiveBt();
		const status = bt ? bt.status : 'init';
		return status === 'running' || status === 'candles';
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
