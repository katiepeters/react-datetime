
// An appraiser is a person who calculate the value of things (tasador)
import historicalPriceLoader from "../state/loaders/historicalPrice.loader";
import priceRangeLoader from "../state/loaders/priceRange.loader";
import { Appraiser } from "./Appraiser";

const DAY = 24 * 60 * 60 * 1000;

interface ProviderAppraiserInput {
	startDate: number
	endDate: number
	provider: string
	baseAssets: string[]
	quotedAsset: string
}

export class ProviderAppraiser implements Appraiser {
	pairs: Set<String>
	quoted: string
	startDate: number
	endDate: number
	provider: string
	loadCallbacks: (() => any)[] = []
	isLoaded: boolean = false

	constructor( input: ProviderAppraiserInput){
		const {startDate, endDate, provider, baseAssets, quotedAsset} = input;

		this.pairs = new Set<String>()
		this.quoted = quotedAsset
		baseAssets.forEach( asset => this.pairs.add(`${asset}/${quotedAsset}`) );

		this.startDate = startDate;
		this.endDate = endDate;
		this.provider = provider;
	}

	isLoading() {
		let loading = false;
		const {provider, startDate, endDate} = this;
		for( let pair in this.pairs ){
			const {isLoading} = priceRangeLoader.getData(provider, pair, startDate, endDate);
			loading = loading || isLoading;
		}

		this.checkEmitLoadEvent( loading );
		
		return loading;
	}

	getPrice( symbol: string, time: number ){
		let pair = `${symbol}/${this.quoted}`;
		if( !pair ) throw new TypeError(`Appriser doesn't support ${symbol} prices`);
		if( time < this.startDate || time > (this.endDate + DAY) ) {
			throw new Error(`Appriser: Date ${time} out of range for ${symbol} price request`);
		}

		let {data: price} = historicalPriceLoader.getData(this.provider, pair, time);
		return price;
	}

	checkEmitLoadEvent( loading: boolean ){
		if( !this.isLoaded ){
			if( loading ){
				setTimeout( () => this.isLoading(), 500 );
			}
			else {
				this.isLoaded = true;
				this.loadCallbacks.forEach( clbk => clbk() );
			}
		}
	}
	addLoadListener( clbk: () => any ){
		this.loadCallbacks.push(clbk);
	}
	removeLoadListener( clbk: () => any ){
		let i = this.loadCallbacks.length;
		while( i-- > 0 ){
			let stored = this.loadCallbacks[i];
			if( stored === clbk ){
				this.loadCallbacks.splice( i, 1 );
			}
		}
	}
}
