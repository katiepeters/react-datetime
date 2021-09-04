import memoizeOne from "memoize-one";
import { ChartCandle } from "./TradingChart";
import { ema, wma, sma, tma, rsi } from "@react-financial-charts/indicators";


const indicatorFunctions: {[name:string]: Function} = { sma, ema, wma, tma, rsi };
const colors = ['#ff0000', '#ffff00', '#00dd22', '#00ffff', '#0000ff', '#ff00ff'];

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
	}
}

// Check if calculated is defined before setting the key
function getMerger( key: string ) {
	return function( data: ChartData, value: number ){
		data.calculated[key] = value;
	}
}

export default chartUtils;