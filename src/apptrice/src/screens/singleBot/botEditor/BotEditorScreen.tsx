import * as React from 'react';
import Editor from '@monaco-editor/react';
import { ScreenProps } from '../../../types';
import BotSaver from '../BotSaver';
import botLoader from '../bot.loader';
import apiCacher from '../../../state/apiCacher';
import styles from './_BotEditorScreen.module.css';
import BotEditorBar from './botEditorBar/BotEditorBar';
import { BacktestConfig } from '../../../common/btSettings/BotTools';
import BtRunner from '../../../utils/backtest/BtRunner';
import botVersionLoader from '../botVersion.loader';
import { BotVersions, DbBotVersion } from '../../../../../lambdas/model.types';

class BotEditorScreen extends React.Component<ScreenProps> {
	state = {
		resources: false,
		codeProblems: []
	}
	currentBotVersion: string = ''
	botSaver: BotSaver = new BotSaver({
		accountId: this.props.store.authenticatedId,
		botId: this.getBotId(this.props),
		apiCacher
	})

	render() {
		const version = this.getLastVersion();
		if (!this.state.resources || !version ) {
			return <span>Loading</span>;
		}

		return (
			<div className={styles.wrapper}>
				<div className={styles.editor}>
					<Editor
						height="100%"
						defaultLanguage="javascript"
						defaultValue={version.code}
						theme="vs-dark"
						options={ this.getEditorOptions() }
						onMount={this._initializeEditor}
						onChange={this._onCodeChange} />
				</div>
				<div className={styles.bar}>
					<BotEditorBar
						botId={ version.botId }
						codeProblems={this.state.codeProblems}
						quickStore={this.props.quickStore}
						currentBackTesting={this.props.store.currentBackTesting}
						onRun={ this._onRunBt }
						onAbort={this._onAbortBt}
						onHighlightLine={ this._highlightLine }/>
				</div>
			</div>
		);
	}

	getEditorOptions() {
		return {
			minimap: { enabled: false },
			automaticLayout: true,
			fontFamily: 'Fira Code',
			fontLigatures: true
		};
	}

	_initializeEditor = (editor: any, monaco: any) => {
		console.log(monaco);
		let defaults = monaco.languages.typescript.javascriptDefaults;

		defaults.setCompilerOptions({
			noLib: true,
			allowNonTsExtensions: true
		});

		// @ts-ignore
		defaults.addExtraLib(this.state.resources.types, '');
		defaults.setDiagnosticsOptions({
			noSemanticValidation: false,
			noSyntaxValidation: false,
		});

		// @ts-ignore
		monaco.editor.defineTheme('editorTheme', this.state.resources.theme);
		monaco.editor.setTheme('editorTheme');
		editor.updateOptions({ contextmenu: false });

		editor.onDidChangeModelDecorations(() => {
			const model = editor.getModel();
			if (model === null || model.getModeId() !== "javascript")
				return;

			const owner = model.getModeId();
			const markers = monaco.editor.getModelMarkers({ owner });
			this.setState({codeProblems: markers});
		});

		const version = this.getLastVersion();
		this.botSaver.currentCode = version ? version.code : '';
	}

	_onCodeChange = (value: string | undefined, event: any) => {
		if (value) {
			this.botSaver.onCodeChange(value);
		}
	}

	componentDidMount() {
		let promises = [
			fetch('/editorTheme.json').then(res => res.json()),
			fetch('/editorTypes.ts').then(res => res.text())
		];

		Promise.all(promises).then(([theme, types]) => {
			this.setState({
				resources: { theme, types }
			})
		});

		this.checkSaverVersion();
	}

	componentDidUpdate() {
		this.checkSaverVersion();
	}

	checkSaverVersion(){
		let version = this.getLastVersion();
		if( version && version.number !== this.currentBotVersion ){
			this.botSaver.setVersion(version.number);
			this.currentBotVersion = version.number;
		}
	}

	getBotId(props: ScreenProps): string {
		return props.router.location.params.id;
	}

	_onRunBt = (config: BacktestConfig) => {
		const botId = this.getBotId(this.props);
		const lastVersion = this.getLastVersion();
		if( lastVersion ){
			let { data: bot } = botLoader.getData(botId);
			BtRunner.start(bot, lastVersion, config);
		}
	}

	_onAbortBt = () => {
		BtRunner.abort();
	}

	_highlightLine = (line:number) => {
		// TODO: Move editor and highlight line
		// https://microsoft.github.io/monaco-editor/playground.html#interacting-with-the-editor-line-and-inline-decorations
	}

	getLastVersion(): DbBotVersion | undefined {
		const botId = this.getBotId(this.props);
		const { data: bot } = botLoader.getData(botId);
		if( !bot ) return;

		const { data: version } = botVersionLoader.getData(botId, this.getLastVersionNumber(bot.versions));
		if( !version ) return;
		return version;
	}

	getLastVersionNumber( versions: BotVersions ) {
		const major = versions.length - 1;
		return `${major}.${versions[major].lastMinor}`;
	}
}

export default BotEditorScreen;
