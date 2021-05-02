import * as React from 'react';
import Editor from '@monaco-editor/react';
import { ScreenProps } from '../../../types';
import BotSaver from '../../botEditor/BotSaver';
import botLoader from '../../botEditor/bot.loader';
import apiCacher from '../../../state/apiCacher';
import styles from './_BotEditorScreen.module.css';
import BotEditorBar from './botEditorBar/BotEditorBar';
import { BacktestConfig } from '../../botEditor/tools/BotTools';
import BtRunner from '../../../utils/BtRunner';
import { Modal } from '../../../components';

class BotEditorScreen extends React.Component<ScreenProps> {
	state = {
		resources: false,
		codeProblems: [],
		showModal: false
	}

	botSaver: BotSaver

	constructor(props: ScreenProps) {
		super(props);
		this.botSaver = new BotSaver({
			accountId: props.store.authenticatedId,
			botId: this.getBotId(props),
			apiCacher
		})
	}

	render() {
		const botId = this.getBotId(this.props);
		const { isLoading, data } = botLoader.getData(this, botId);
		if (!this.state.resources || isLoading || !data) {
			return <span>Loading</span>;
		}

		return (
			<div className={styles.wrapper}>
				<div className={styles.editor}>
					<Editor
						height="100%"
						defaultLanguage="javascript"
						defaultValue={data.code}
						theme="vs-dark"
						options={ this.getEditorOptions() }
						onMount={this._initializeEditor}
						onChange={this._onCodeChange} />
				</div>
				<div className={styles.bar}>
					<BotEditorBar
						codeProblems={this.state.codeProblems}
						quickStore={this.props.quickStore}
						currentBackTesting={this.props.store.currentBackTesting}
						onRun={ this._onRunBt }
						onAbort={this._onAbortBt}
						onHighlightLine={ this._highlightLine }/>
				</div>
				{ this.renderModal() }
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

		const { data } = botLoader.getData(this, this.getBotId(this.props));
		this.botSaver.currentCode = data ? data.code : '';
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

		setInterval(
			() => this.setState({ showModal: !this.state.showModal }),
			5000
		);
	}

	getBotId(props: ScreenProps): string {
		return props.router.location.params.id;
	}

	_onRunBt = (config: BacktestConfig) => {
		const botId = this.getBotId(this.props);
		let { data } = botLoader.getData(this, botId);
		let botData = {
			botId,
			source: data?.code
		};

		BtRunner.start(botData, config);
	}

	_onAbortBt = () => {
		BtRunner.abort();
	}

	_highlightLine = (line:number) => {
		// TODO: Move editor and highlight line
		// https://microsoft.github.io/monaco-editor/playground.html#interacting-with-the-editor-line-and-inline-decorations
	}


	renderModal() {
		return (
			<Modal open={ this.state.showModal }>
				{ () => (
					<div>ModalContent</div>
				)}
			</Modal>
		);
	}
}

export default BotEditorScreen;
