type ReducerInput<ST,ARG> = (store: ST, arg: ARG) => ST;
type ReducerOutput<ARG> = (arg: ARG) => void;

type SelectorInput<ST,ARG,RET> = (store: ST, arg: ARG) => RET;
type SelectorOutput<ARG,RET> = (arg: ARG) => RET;

interface LoaderInput<ST,INP> {
	selector: (store: ST, arg: INP) => any
	load: (arg: INP) => Promise<any>
	isValid?:( arg: INP ) => boolean
}

interface LoaderOutput<INP,RET> {
	isLoading: boolean
	data: RET | undefined
	error: any
	retry: (arg: INP) => void
	promise: Promise<any>
}

type LoaderFunction<ARG,RET> = (input: ARG) => LoaderOutput<ARG,RET>;

export interface Lorese<ST> {
	addChangeListener( clbk: () => any): void
	removeChangeListener( clbk: () => any): void
	emitStateChange(): void
	loader<INP,RET>( config: LoaderInput<ST,INP> ): LoaderFunction<INP,RET>
	reducer<ARG>( clbk: ReducerInput<ST,ARG> ): ReducerOutput<ARG>
	selector<ARG,RET>( clbk: SelectorInput<ST,ARG,RET> ): SelectorOutput<ARG,RET>
}

export default function lorese<ST>( store: ST ): Lorese<ST>{
	let listeners: (() => any)[] = [];

	let changeBatched = false;
	function emitChange(){
		// Batch multiple changes in the same cycle
		if( changeBatched ) return;
		changeBatched = true;
		setTimeout( () => {
			listeners.forEach( l => l() )
			changeBatched = false;
		});
	}

	return {
		addChangeListener( clbk: () => any ){
			listeners.push( clbk );
		},
		removeChangeListener( clbk: () => any ){
			let i = listeners.length;
			while( i-- > 0 ){
				if( clbk === listeners[i] ){
					listeners.splice(i,1);
				}
			}
		},
		emitStateChange: emitChange,
		loader: function<INP,RET>( config: LoaderInput<ST,INP> ): LoaderFunction<INP,RET> {
			const isValid = config.isValid || (() => true);
			const loadCache = new Map<string,LoaderOutput<INP,RET>>();
			
			function loadData(input: INP, cached: RET | void) {
				const key = JSON.stringify(input);
				let promise = config.load(input);
				loadCache.set(key, {
					isLoading: true,
					error: null,
					promise: promise,
					data: config.selector(store, input),
					retry: tryLoad
				});

				promise
					.then( () => {
						loadCache.set(key, {
							isLoading: false,
							error: null,
							promise: promise,
							data: config.selector(store, input),
							retry: tryLoad
						});
					})
					.catch( err => {
						loadCache.set(key, {
							isLoading: false,
							error: err,
							promise: promise,
							data: undefined,
							retry: tryLoad
						});
					})
					.finally( () => {
						emitChange();
					})
				;
			}

			function tryLoad( input: INP ){
				const key = JSON.stringify(input);
				let loaded = loadCache.get(key);
				const cached = config.selector(store, input);

				const isValidLoad = loaded && (
					loaded.error ||
					loaded.isLoading ||
					(loaded.data === cached && isValid(input))
				);
				
				// Try to reuse the cached object
				if( loaded && isValidLoad ){
					return loaded;
				}

				// If the selector data has been updated, upate the cached data
				if( loaded && cached && isValid(input) && loaded.data !== cached ){
					loaded = {
						isLoading: false,
						error: null,
						data: cached,
						retry: tryLoad,
						promise: Promise.resolve(cached)
					}
					loadCache.set(key, loaded);
					return loaded;
				}

				// The data is not loaded, load it
				loadData(input);
				loaded = loadCache.get(key);

				if( !loaded ) throw new Error('Load not cached');

				// return the loading data
				return loaded;
			}

			return tryLoad;
		},
		reducer: function<ARG>( clbk: ReducerInput<ST,ARG> ): ReducerOutput<ARG> {
			return function(arg: ARG) {
			let updated = clbk( store, arg );
				store = updated;
				emitChange();
			}
		},
		selector: function<ARG,RET>( clbk: SelectorInput<ST,ARG,RET> ): SelectorOutput<ARG,RET> {
			return function(arg: ARG){
				return clbk(store, arg);
			}
		}
	}
}