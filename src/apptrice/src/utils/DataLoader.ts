import { ReactInstance } from "react"

export interface DataLoaderConfig<T> {
	getFromCache: (id: string) => T | undefined
	isValid?: (data?: T) => boolean
	loadData: (id: string) => Promise<any>
}

export interface DataLoaderResult<T> {
	error: any
	isLoading: boolean
	data?: T
}

export default class DataLoader<T> {
	getFromCache: (id: string) => T | undefined
	isValid: (id: T) => boolean
	loadData: (id: string) => Promise<any>
	promises: { [key: string]: Promise<any> } = {}
	values: { [key: string]: DataLoaderResult<T> } = {}

	constructor(config: DataLoaderConfig<T>) {
		this.getFromCache = config.getFromCache;
		this.isValid = config.isValid || (() => true);
		this.loadData = config.loadData;
	}

	getData(instance: ReactInstance, id: string) {
		let value = this.values[id];
		if (value) {
			return value;
		}

		let cachedData = this.getFromCache(id);
		if (!cachedData || !this.isValid(cachedData)) {
			this.handleDataLoading(id, instance);
			this.setValue(id, { error: false, isLoading: true, data: cachedData });
		}
		else {
			this.setValue(id, { error: false, isLoading: false, data: cachedData });
		}

		return this.values[id];
	}

	handleDataLoading(id: string, instance: ReactInstance) {
		if (this.promises[id]) {
			// @ts-ignore
			this.promises[id].finally(() => instance.forceUpdate());
		}

		this.promises[id] = this.loadData(id)
			.then(res => {
				delete this.promises[id];

				if (res.error) {
					let cachedData = this.getFromCache(id);
					this.setValue(id, { error: res.error, isLoading: false, data: cachedData });
				}
				else {
					this.setValue(id, { error: false, isLoading: false, data: res.data });
				}

				// @ts-ignore
				instance.forceUpdate();
				return res;
			})
			.catch(error => {
				let cachedData = this.getFromCache(id);
				this.setValue(id, { error: error, isLoading: false, data: cachedData });
			})
			;
	}

	setValue(id: string, value: DataLoaderResult<T>) {
		let stored = this.values[id];
		if (!stored || stored.error !== value.error || stored.isLoading !== value.isLoading || stored.data !== value.data) {
			this.values[id] = value;
		}
		return this.values[id];
	}

	clearValue(id: string) {
		delete this.values[id];
	}
}