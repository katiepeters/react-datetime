import memoizeOne from "memoize-one";
import { ChartCandle } from "./TradingChart";
import { ema, wma, sma, tma, rsi } from "@react-financial-charts/indicators";
import { Coords } from "../../../../lambdas/_common/botRunner/botRunPlotter";


const indicatorFunctions: {[name:string]: Function} = { sma, ema, wma, tma, rsi };
export const colors = ['#ff0000', '#ffff00', '#00dd22', '#00ffff', '#0000ff', '#ff99cc'];

export interface ChartData extends ChartCandle {
	calculated: {
		[key: string]: number
	}
}

export interface RunnableIndicator {
	key: string,
	type: string,
	args: any[],
	tooltip: string,
	color: string,
	func: Function
}

export interface DrawingIndices {startIndex: number | undefined, endIndex: number}; 


// Cache accessor to always pass the same object to the components
let cachedAccessors: {[key: string]: (d:ChartData) => number} = {};

const chartUtils = {
	xAccessor(d: ChartCandle){
		return d.date;
	},

	getYAccessor(key: string){
		if(cachedAccessors[key]) return cachedAccessors[key];

		if( ['open', 'close', 'high', 'low', 'volume'].includes(key) ){
			cachedAccessors[key] = function(d: ChartData){
				// @ts-ignore
				return d[key];
			}
		}
		else {
			cachedAccessors[key] = function(d: ChartData){
				// @ts-ignore
				console.log(key);
				return d.calculated[key];
			}
		}

		return cachedAccessors[key];
	},

	getRunnableIndicators: memoizeOne( (sources: string[] | undefined ) => {
		let indicators: RunnableIndicator[] = [];
		if( !sources ) return indicators;

		let i = 0;

		sources.forEach( (source:string) => {
			let [name, ...args] = source.split('|');
			if( ['sma', 'ema', 'wma', 'tma'].includes(name) ){
				indicators.push({
					key: source,
					type: name,
					args: args,
					tooltip: 'ma',
					color: colors[i++],
					func: indicatorFunctions[name]()
						.options({ windowSize: parseInt(args[0])})
						.merge( getMerger(source) )
						.accessor((data:any) => {
							return data.calculated[source];
						})
				});
			}
			else if(name === 'vma') {
				indicators.push({
					key: source,
					type: name,
					args,
					tooltip: 'ma',
					color: colors[i++],
					func: indicatorFunctions.ema()
						.options({windowSize: parseInt(args[0]), sourcePath: 'volume'})
						.merge( getMerger(source)  )
						.accessor((data:any) => data.calculated[source])
				})
			}
			else if(name === 'rsi' ){
				indicators.push({
					key: source,
					type: name,
					args,
					tooltip: 'rsi',
					color: colors[i++],
					func: indicatorFunctions.rsi()
						.options({windowSize: parseInt(args[0])})
						.merge( getMerger(source)  )
						.accessor((data:any) => data.calculated[source])
				})
			}
			else {
				console.warn(`Unknown indicator ${name}`)
			}
		});

		return indicators;
	}),

	candleAccessor(d: ChartCandle ){
		return d;
	},

	getFormat( quantity: number ){
		if( quantity > 9999 ){
			return ',.0f'
		}
		if( quantity > 99 ){
			return ',.2f'
		}
		if( quantity > 0 ){
			return '.4f'
		}
		return '.7f'
	},
	getDrawingIndices( points: Coords[], dataStart: number, dataEnd: number ): DrawingIndices {
		const length = points.length;
		let startIndex, endIndex;

		// If we are out of range just return undefined
		if( points[0].x > dataEnd || points[length-1].x < dataStart ){
			return {startIndex, endIndex: 0};
		}
		
		let before = 0; 
		let ahead = points.length-1;

		// Find the start index
		if( dataStart < points[0].x ){
			startIndex = 0;
		}
		else {
			//  binary search
			while (startIndex === undefined && before<ahead ){
				// Find the mid index
				let mid = Math.floor((before + ahead)/2);
				let x = points[mid].x;
				if( x === dataStart ){
					startIndex = mid;
				}
				else if( x < dataStart && points[mid+1].x > dataStart ){
					startIndex = mid+1;
				}
				else if( x < dataStart ){
					before = mid+1;
				}
				else {
					ahead = mid;
				}
			}
		}

		if( dataEnd > points[length-1].x ){
			endIndex = length - 1;
		}
		else {
			// @ts-ignore
			before = startIndex;
			ahead = points.length - 1;

			while( endIndex === undefined && before<ahead ){
				// Find the mid index
				let mid = Math.floor((before + ahead)/2);
				let x = points[mid].x;
				if( x === dataEnd ){
					endIndex = mid;
				}
				else if( x < dataEnd && points[mid+1].x > dataEnd ){
					endIndex = mid+1;
				}
				else if( x < dataEnd ){
					before = mid+1;
				}
				else {
					ahead = mid;
				}
			}
		}

		// @ts-ignore
		return {startIndex, endIndex};
	}
}



// Check if calculated is defined before setting the key
function getMerger( key: string ) {
	return function( data: ChartData, value: number ){
		data.calculated[key] = value;
	}
}

export default chartUtils;