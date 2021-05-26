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
		let env = this.getEnvironment();
		return environments[env].apiUrl;
	},

	getS3Url(): string {
		let env = this.getEnvironment();
		return environments[env].s3Url;
	},

	setEnvironment( env: string ) {
		ls.setItem('env', env);
		this.emitChange();
	},

	getEnvironment(): string{
		return ls.getItem('env') || 'local';
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


let environments: any = {
	local: {
		apiUrl: 'http://localhost:3030/dev',
		s3Url: 'http://localhost:4569/aws-trader-dev-exchanges'
	},
	awsTest: {
		apiUrl: 'https://b682acd3ie.execute-api.eu-west-1.amazonaws.com/dev',
		s3Url: 'https://aws-trader-dev-exchanges.s3-eu-west-1.amazonaws.com'
	}
}