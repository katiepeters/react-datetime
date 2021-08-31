import * as React from 'react'
import { ArrayCandle } from '../../../../lambdas/lambda.types';
import { Order } from '../../../../lambdas/model.types';
import TradingChart, {ChartCandle} from './TradingChart';
import memoizeOne from 'memoize-one';
import { candleLoader } from '../../state/loaders/candle.loader';



interface AutoChartProps {
	pair: string,
	exchange: string,
	interval: string,
	orders: Order[],
	indicators?: string[],
	patterns?: string[],
	startDate: number,
	endDate: number
}

interface AutoChartState {
	loadingDate?: number
	alreadyLoadedDate?: number
	chartStartDate: number
	candles?: ArrayCandle[]
	hasMore: boolean
}

// Loads candles automatically while moving the chart
export default class AutoChart extends React.Component<AutoChartProps> {
	state: AutoChartState = {
		loadingDate: undefined,
		alreadyLoadedDate: undefined,
		chartStartDate: this.getDateToLoad( this.props.interval, this.props.startDate ),
		candles: undefined,
		hasMore: false
	}
		
	render() {
		return (
			<div>
				{ this.state.candles ? this.renderChart( this.state.candles || [] ) : 'Loading...' }
			</div>
		);
	}

	renderChart( candles: ArrayCandle[] ) {
		const {startDate, endDate} = this.props;
		return (
			<TradingChart
				orders={this.props.orders}
				candles={ getChartCandles(candles) }
				indicators={ this.props.indicators || [] }
				patterns={ this.props.patterns || [] }
				onLoadMore={ this._onLoadMore }
				highlightedInterval={[startDate, endDate]} />
		)
	}

	componentDidUpdate(){
		this.checkCandlesLoad();
	}

	componentDidMount(){
		this.checkCandlesLoad();
	}

	getDateToLoad( interval: string, endDate: number ){
		// Let's say interval is always 1h for the time being
		let time = (60 * 60 * 1000) * 200; // 200 candles
		return endDate - time;
	}

	checkCandlesLoad() {
		const {loadingDate, chartStartDate, alreadyLoadedDate, candles } = this.state;
		if( loadingDate ) return;

		if( alreadyLoadedDate === undefined ){
			const {interval, endDate} = this.props;
			const dateToLoad = this.getDateToLoad(interval, endDate);
			return this.loadCandles(dateToLoad, endDate);
		}

		let loadedDate = alreadyLoadedDate || Date.now();
		if( candles && chartStartDate < candles[50][0] ){
			const {interval} = this.props;
			const dateToLoad = this.getDateToLoad(interval, loadedDate);
			return this.loadCandles(dateToLoad, loadedDate);
		}
	}

	loadCandles( dateToLoad: number, endDate: number ){
		const {exchange, pair, interval} = this.props;
		let {data: candles, promise} = candleLoader({
			exchange, pair, runInterval: interval, startDate: dateToLoad, endDate
		});

		if( candles ){
			this.setState({
				candles: [...candles, ...(this.state.candles || [])],
				alreadyLoadedDate: dateToLoad
			})
		}
		else {
			this.setState({loadingDate: dateToLoad});
			promise.then( response => {
				this.setState({
					loadingDate: false,
					candles: [...response.data, ...(this.state.candles || [])],
					alreadyLoadedDate: dateToLoad
				})
			});
		}
	}

	_onLoadMore = (start:number, end: number) => {
		this.setState({chartStartDate: start});
	}
}

const getChartCandles = memoizeOne( (candles: ArrayCandle[]) => {
	return candles.map( toChartCandle );
});

function toChartCandle( c: ArrayCandle ): ChartCandle{
	return {
		date: new Date(c[0]),
		open: c[1],
		close: c[2],
		high: c[3],
		low: c[4],
		volume: c[5]
	}
}
