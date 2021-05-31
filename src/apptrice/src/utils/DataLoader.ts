export interface DataLoaderConfig<T> {
	getFromCache: (...args: any[]) => T | undefined
	isValid?: (...args: any[]) => boolean
	invalidate?: (...args:any[]) => void
	loadData: (...args: any[]) => Promise<any>
}
export interface DataLoaderResult<T> {
	error: any
	isLoading: boolean
	data?: T
	retry: () => any
}

class DataLoader<T> {

	// This has to be set to update the app on initialization
	static onChange = () => {} 

	loadState = new Map();
	getFromCache
	loadData
	isValid = (...args: any[]) => true
	invalidate = (...args: any[]) => {}

	constructor(config: DataLoaderConfig<T>) {
		this.getFromCache = config.getFromCache;
		this.loadData = config.loadData;

		if (config.isValid) {
			this.isValid = config.isValid;
		}
		if (config.invalidate) {
			this.invalidate = config.invalidate;
		}
	}

	getData(...args: any[]) {
		const cachedData = this.getFromCache(...args);
		const key = JSON.stringify(args);
		const loadDataState = this.loadState.get(key);
		const { error } = loadDataState || {};

		if (!error && cachedData !== undefined && this.isValid(...args)) {
			if (loadDataState) {
				this.loadState.delete(key);
			}

			return {
				isLoading: false,
				error: null,
				data: cachedData,
				retry: this.retry.bind(this),
			};
		}

		if (loadDataState) {
			return loadDataState;
		}

		return this.load(key, ...args);
	}

	load(key: string, ...args: any[]) {
		this.loadData(...args)
			.then(response => {
				this.loadState.delete(key);
				return response;
			})
			.catch((err) => {
				this.loadState.set(key, {
					isLoading: false,
					error: err,
					data: null,
					retry: this.retry.bind(this)
				});
				DataLoader.onChange();
			})
		;

		const response = {
			isLoading: true,
			error: null,
			data: null,
			retry: this.retry.bind(this)
		};

		this.loadState.set(key, response);
		return response;
	}

	retry(...args: any[]) {
		const key = JSON.stringify(args);
		this.loadState.delete(key);
		DataLoader.onChange();
		this.load(key, ...args);
	}
}

export default DataLoader;