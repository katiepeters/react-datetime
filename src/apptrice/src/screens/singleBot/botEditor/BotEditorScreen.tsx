import * as React from 'react';
import Editor from '@monaco-editor/react';
import { ScreenProps } from '../../../types';
import BotSaver from '../BotSaver';
import apiCacher from '../../../state/apiCacher';
// import styles from './_BotEditorScreen.module.css';
import BotEditorBar from './botEditorBar/BotEditorBar';
import { BacktestConfig } from '../../../common/btSettings/BotTools';
import BtRunner from '../../../utils/backtest/BtRunner';
import BotEditorLayout from './BotEditorLayout';
import { BotScreenProps } from '../BotScreenProps';
import { botVersionLoader } from '../../../state/loaders/botVersion.loader';
import { StoreBotVersion } from '../../../state/stateManager';

class BotEditorScreen extends React.Component<BotScreenProps> {
	state = {
		resources: false,
		codeProblems: []
	}

	// These doesn't need to be in the state
	// because they don't trigger re-renders
	currentBotVersion: string = ''
	isBumpingVersion: boolean = false
	bumpingCodeCache: string = ''
	botSaver: BotSaver = new BotSaver({
		accountId: this.props.bot.accountId,
		botId: this.props.bot.id,
		apiCacher
	})

	render() {
		const version = this.getEditingVersion();
		if (!this.state.resources || !version ) {
			return <span>Loading</span>;
		}

		return (
			<BotEditorLayout
				mainTop={ this.renderEditor(version) }
				mainBottom={ this.renderBar(version) }
				side={ <span /> } />
		);
	}

	renderEditor(version: StoreBotVersion) {
		return (
			<Editor
				defaultLanguage="javascript"
				defaultValue={version.code}
				theme="vs-dark"
				options={ this.getEditorOptions() }
				onMount={this._initializeEditor}
				onChange={this._onCodeChange} />
		)
	}

	renderBar(version: StoreBotVersion) {
		return (
			<BotEditorBar
				version={ version }
				codeProblems={this.state.codeProblems}
				onRun={ this._onRunBt }
				onAbort={this._onAbortBt}
				onHighlightLine={ this._highlightLine }/>
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

		const version = this.getEditingVersion();
		this.botSaver.currentCode = version ? version.code : '';
	}

	_onCodeChange = (value: string | undefined, event: any) => {
		if( !value ) return;

		if( value && this.isBumpingVersion ){
			this.bumpingCodeCache = value;
			return;
		}
		
		const version = this.getEditingVersion();
		if( version?.isLocked ){
			this.isBumpingVersion = true;
			this.bumpingCodeCache = value;
			return this.bumpVersion();
		}

		this.botSaver.onCodeChange(value);
	}

	bumpVersion(){
		const {id: botId, accountId} = this.props.bot;
		apiCacher.createBotVersion({
			accountId,
			botId,
			type: 'minor',
			sourceNumber: this.getEditingVersionNumber()
		})
		.then( res => {
			let bumpedVersion = res.data.number;

			this.isBumpingVersion = false;
			this.botSaver.setVersion(bumpedVersion);
			this.botSaver.onCodeChange(this.bumpingCodeCache);

			const {router} = this.props;
			const {query} = router.location;
			if( query.v ){
				this.props.router.replace({
					query: {
						...query,
						v: bumpedVersion
					}
				});
			}
		})
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
		let version = this.getEditingVersionNumber();
		if( version !== this.botSaver.getVersion() ){
			this.botSaver.setVersion(version);
		}
	}

	getBotId(props: ScreenProps): string {
		return props.router.location.params.id;
	}

	_onRunBt = (config: BacktestConfig) => {
		const {id: botId, accountId} = this.props.bot;
		const version = this.getEditingVersion();
		if( version ){
			BtRunner.start(version, config);
			if( !version.isLocked ) {
				apiCacher.updateBotVersion(
					accountId,
					botId,
					version.number,
					{isLocked: true}
				);
			}
		}
	}

	_onAbortBt = () => {
		BtRunner.abort();
	}

	_highlightLine = (line:number) => {
		// TODO: Move editor and highlight line
		// https://microsoft.github.io/monaco-editor/playground.html#interacting-with-the-editor-line-and-inline-decorations
	}

	getLastVersionNumber(): string | undefined {
		const {bot} = this.props;
		const major = bot.versions.length - 1;
		return `${major}.${bot.versions[major].lastMinor}`;
	}

	getEditingVersionNumber(){
		return this.props.router.location.query.v ||
			this.botSaver.getVersion() ||
			this.getLastVersionNumber()
		;
	}

	getEditingVersion(): StoreBotVersion | undefined {
		let versionNumber = this.getEditingVersionNumber();
		if( !versionNumber ) return;

		const {id: botId, accountId} = this.props.bot;
		const { data: version } = botVersionLoader({accountId, botId, versionNumber});
		return version;
	}
}

export default BotEditorScreen;
