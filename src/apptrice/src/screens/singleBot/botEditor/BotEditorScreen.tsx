import * as React from 'react';
import Editor from '@monaco-editor/react';
import { ScreenProps } from '../../../types';
import BotSaver from '../../botEditor/BotSaver';
import botLoader from '../../botEditor/bot.loader';
import apiCacher from '../../../state/apiCacher';
import styles from './BotEditorScreen.module.css';

class BotEditorScreen extends React.Component<ScreenProps> {
	state = {
		resources: false
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
				<Editor
					height="100vh"
					defaultLanguage="javascript"
					defaultValue={data.code}
					theme="vs-dark"
					options={{ minimap: { enabled: false }, automaticLayout: true }}
					onMount={this._initializeEditor}
					onChange={this._onCodeChange} />
			</div>
		);
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
	}

	getBotId(props: ScreenProps): string {
		return props.router.location.params.id;
	}
}

export default BotEditorScreen;
