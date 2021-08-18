// An appraiser is a person who calculate the value of things (tasador)
export interface Appraiser { 
	isLoading(): boolean
	addLoadListener(clbk: () => any): void
	removeLoadListener(clbk: () => any): void
	getPrice(pair: string, time: number): number
}
