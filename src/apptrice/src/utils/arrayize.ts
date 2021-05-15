export default function arrayize<T>( obj: any ){
	return {
		map( clbk: (value: T, key: string) => any ){
			let result: {[key: string]: any} = {};
			for( let key in obj ){
				result[key] = clbk( obj[key], key );
			}
			return result;
		},
		forEach( clbk: (value: T, key?: string) => any ){
			for( let key in obj ){
				clbk( obj[key], key);
			}
		},
		filter( clbk: (value: T, key?: string) => boolean ){
			let result: {[key: string]: T} = {};
			for( let key in obj ){
				if( clbk( obj[key], key) ){
					result[key] = obj[key];
				}
			}
			return result;
		},
		filterKeys(keys: string[]) {
			let result: { [key: string]: T } = {};
			for (let key in obj) {
				if ( keys.includes(key) ) {
					result[key] = obj[key];
				}
			}
			return result;
		},
		find( clbk: (value: T, key?: string) => boolean ): T | undefined {
			let keys = Object.keys(clbk);
			let i = 0;
			while( i < keys.length ){
				if( clbk( obj[keys[i]], keys[i])  ){
					return obj[keys[i]];
				}
				i++;
			}
		},
		
		isEmpty(): boolean {
			return Object.keys( obj ).length === 0;
		}
	}
}