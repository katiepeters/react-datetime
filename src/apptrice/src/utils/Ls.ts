const LS_PREFIX = 'TD_'
export const ls = {
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