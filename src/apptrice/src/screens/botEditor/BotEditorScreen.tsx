import * as React from 'react';
import Editor from '@monaco-editor/react';
import { ScreenProps } from '../../types';
import botLoader from './bot.loader';
import BotSaver from './BotSaver';
import apiCacher from '../../state/apiCacher';
import BootTools, {BacktestConfig} from './tools/BotTools';
import { createBot } from './backtesting/botWorker';
import { runBacktest } from './backtesting/backtestRunner';

class BotEditorScreen extends React.Component<ScreenProps> {
	state = {
		resources: false
	}

	botSaver: BotSaver

	constructor(props: ScreenProps){
		super( props );
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
			<div style={ styles.wrapper }>
				<div style={styles.editor}>
					<Editor
						height="100vh"
						defaultLanguage="javascript"
						defaultValue={data.code}
						theme="vs-dark"
						options={{ minimap: { enabled: false }, automaticLayout: true }}
						onMount={this._initializeEditor}
						onChange={this._onCodeChange} />
				</div>
				<div style={styles.tools}>
					<BootTools onRun={this._onRunBacktesting }/>
				</div>
			</div>
		);
	}

	_onRunBacktesting = ( config: BacktestConfig ) => {
		let symbols = config.baseAssets.map( base => `${base}/${config.quotedAsset}` );

		let start = ( new Date(config.startDate + 'T00:00:00.000Z') ).getDate();
		const end = (new Date(config.startDate + 'T23:59:59.999Z')).getDate();
		start = add200Candles( start, config.interval );

		console.log( config, symbols );

		runBacktest( this.botSaver.currentCode, config);
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
		if( value ){
			this.botSaver.onCodeChange( value );
		}

		this.setState({botSource: value});
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

	getBotId( props: ScreenProps ): string {
		return props.router.location.params.id;
	}
}

const intervalTime = {
	'5m': 5 * 60 * 1000,
	'10m': 10 * 60 * 1000,
	'30m': 30 * 60 * 1000,
	'1h': 60 * 60 * 1000,
	'4h': 4 * 60 * 60 * 1000,
	'1d': 24 * 60 * 60 * 1000
};
function add200Candles( start: number, interval: string ) {
	// @ts-ignore
	return start - (intervalTime[interval] * 200);
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
		flexWrap: 'nowrap',
		minWidth: 0
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