import * as React from 'react';
import Editor from '@monaco-editor/react';
import { ScreenProps } from '../../types';
import botLoader from './bot.loader';
import BotSaver from './BotSaver';
import apiCacher from '../../state/apiCacher';
import BootTools from './tools/BotTools';

class BotEditorScreen extends React.Component<ScreenProps> {
	state = {
		resources: false
	}

	botSaver: BotSaver

	constructor(props: ScreenProps){
		super( props );
		this.botSaver = new BotSaver({
			accountId: props.store.authenticatedId,
			botId: props.router.location.params.id,
			apiCacher
		})
	}

	render() {
		const botId = this.props.router.location.params.id;
		const { isLoading, data } = botLoader.getData(this, botId);
		if (!this.state.resources || isLoading || !data) {
			return <span>Loading</span>;
		}

		return (
			<div style={ styles.wrapper }>
				<div style={styles.editor}>
					<Editor
						height="100vh"
						defaultLanguage="javascript"
						defaultValue={data.code}
						theme="vs-dark"
						options={{ minimap: { enabled: false } }}
						onMount={this._initializeEditor}
						onChange={this._onCodeChange} />
				</div>
				<div style={styles.tools}>
					<BootTools />
				</div>
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
	}

	_onCodeChange = (value: string | undefined, event: any) => {
		if( value ){
			this.botSaver.onCodeChange( value );
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
}

export default BotEditorScreen;

type StyleSheet = {
	[id: string]: React.CSSProperties
}

const styles: StyleSheet = {
	wrapper: {
		display: 'flex',
		flexGrow: 1,
		flexDirection: 'row',
		flexWrap: 'nowrap'
	},
	editor: {
		display: 'flex',
		flexGrow: 1,
		minWidth: 0,
		overflow: 'hidden'
	},
	tools: {
		display: 'flex',
		width: 250,
		backgroundColor: '#102433',
	}
}