import Emitter from 'eventemitter3';


let emitter = new Emitter();

let changeTimer: any = false;
const localStore = {
	addChangeListener(clbk: () => void) {
		return emitter.on('change', clbk);
	},
	removeChangeListener(clbk: () => void) {
		return emitter.off('change', clbk);
	},
	emitChange() {
		if (changeTimer) return;
		changeTimer = setTimeout(() => {
			changeTimer = false;
			emitter.emit('change');
		});
	},

	getApiUrl(): string {
		return ls.getItem('API_URL') || 'http://localhost:3030/dev';
	},

	setApiUrl(url: string) {
		ls.setItem('API_URL', url);
		this.emitChange();
	}
}

export default localStore;

const LS_PREFIX = 'TD_'
const ls = {
	setItem( key: string, value: any ): void{
		localStorage.setItem(`${LS_PREFIX}${key}`, JSON.stringify(value) );
	},
	getItem( key: string ): any{
		let value = localStorage.getItem(`${LS_PREFIX}${key}`);
		if( value ){
			return JSON.parse(value);
		}
	}
}