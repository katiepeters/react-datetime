const SAVE_TIMEOUT = 2000;

interface BotSaverConfig {
	accountId: string
	botId: string
	apiCacher: any
	onSaveStart?: () => void
	onSaveEnd?: () => void
}

export default class BotSaver {
	accountId: string
	botId: string
	apiCacher: any
	currentCode: string
	saveTimer: number | any
	onSaveStart: () => void = () => { }
	onSaveEnd: () => void = () => { }

	constructor( config: BotSaverConfig ) {
		this.apiCacher = config.apiCacher;
		this.accountId = config.accountId;
		this.botId = config.botId;

		if( config.onSaveStart ){
			this.onSaveStart = config.onSaveStart;
		}
		if (config.onSaveEnd) {
			this.onSaveEnd = config.onSaveEnd;
		}

		this.saveTimer = 0;
		this.currentCode = ''
	}

	onCodeChange( code: string ) {
		if( this.saveTimer ){
			clearTimeout( this.saveTimer );
		}

		this.currentCode = code;
		this.saveTimer = setTimeout( this._saveCode, SAVE_TIMEOUT );
		return;
	}

	_saveCode = () => {
		const { apiCacher, accountId, botId, currentCode } = this;
		this.saveTimer = 0;

		this.onSaveStart();
		apiCacher.updateBot( accountId, botId, currentCode )
			.then( () => {
				this.onSaveEnd();
			})
		;
	}
}