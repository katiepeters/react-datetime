import * as React from 'react';
import Editor from '@monaco-editor/react';

class EditorScreen extends React.Component {
	state = {
		resources: false
	}

	render() {
		if( !this.state.resources ){
			return <span>Loading</span>;
		}

		let text = `
		import { TradeBot, BotInput } from "../TradeBot";

export default class TestBot extends TradeBot {
	hello( name: string) {
		return getHello( name );
	}
	onData({ config, state, trader, candles, utils }: BotInput ) {
		config.symbols.forEach( symbol => {
			if( state[symbol] ){
				trader.cancelOrder( state[symbol] );
			}

			const {getClose, getLast} = utils.candles;
			const currentPrice = getClose( getLast(candles[symbol]) );

			trader.placeOrder({
				type: 'limit',
				direction: 'buy',
				price: currentPrice * 1.2,
				symbol,
				amount: 100
			});
		})
	}
}


function getHello( name ){
	return "Hola name";
}`;
		return (
			<div>
				<Editor
					height="100vh"
					defaultLanguage="javascript"
					defaultValue={text}
					onChange={content => console.log(content)}
					theme="vs-dark"
					options={{ minimap: { enabled: false } }}
					onMount={ this._initializeEditor } />
			</div>
		);
	}

	_initializeEditor = (editor: any, monaco: any) => {
		console.log( monaco );
		let defaults = monaco.languages.typescript.javascriptDefaults;


		defaults.setCompilerOptions({
			noLib: true,
			allowNonTsExtensions: true
		});

		// @ts-ignore
		defaults.addExtraLib( this.state.resources.types, '');
		defaults.setDiagnosticsOptions({
			noSemanticValidation: false,
			noSyntaxValidation: false,
		});

		// @ts-ignore
		monaco.editor.defineTheme('editorTheme', this.state.resources.theme);
		monaco.editor.setTheme('editorTheme');
		editor.updateOptions({contextmenu: false});
	}

	componentDidMount(){
		let promises = [
			fetch('/editorTheme.json').then(res => res.json()),
			fetch('/editorTypes.d.ts').then(res => res.text())
		];

		Promise.all( promises ).then( ([theme, types]) => {
			this.setState({
				resources: { theme, types }
			})
		});
	}
}

export default EditorScreen;