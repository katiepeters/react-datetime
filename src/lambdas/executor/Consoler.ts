export interface RunConsole {
	log(...messages: any[]): void
	warn(...messages: any[]): void
	error(...messages: any[]): void
	getEntries(): ConsoleEntry[]
	clear(): void
}

export interface ConsoleEntry {
	id: number,
	date: number,
	type: 'error' | 'warn' | 'log',
	message: string
}

let entries: ConsoleEntry[] = [];
let ori = console;
const cons: RunConsole = {
	log(...messages: any[]) {
		addEntry('log', messages);
		ori.log.apply( ori, messages );
	},

	warn(...messages: any[]) {
		addEntry('warn', messages);
		ori.warn.apply(ori, messages);
	},

	error(...messages: any[]) {
		addEntry('error', messages);
		ori.error.apply(ori, messages);
	},

	getEntries(){
		return [...entries];
	},

	clear(){
		entries = [];
	}
}

export default cons;

function addEntry( type: string, messages: any[] ){
	entries.push({
		id: Math.round(Math.random() * 1000),
		date: Date.now(),
		type: 'log',
		message: messages.map( m => stringify(m) ).join(' ')
	})
}

function stringify( m: string ){
	return typeof m === 'string' ?
		m :
		JSON.stringify(m, null, 2)
	;
}