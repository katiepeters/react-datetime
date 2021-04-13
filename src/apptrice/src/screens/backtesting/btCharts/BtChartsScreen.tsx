import * as React from 'react'
import { ScreenProps } from '../../../types'
import btStatsLoader from '../btStats.loader'
import Chart from 'react-apexcharts'
import styles from './BtChartsScreen.module.css';
import CanvasChart from './CanvasChart';


export default class BtChartsScreen extends React.Component<ScreenProps> {
	render() {
		let {data: stats, isLoading} = btStatsLoader.getData(this, 'bt');

		if( isLoading ){
			return 'Loading...';
		}

		const data = [
			{ type: 'candlestick', dataPoints: stats.candles['ETH/USD']}
		]

		return (
			<div className={styles.container}>
				<CanvasChart title={{}} data={data} />
			</div>
		)
	}


	renderApexChart(stats: any) {

		const options = {
					chart: {
					animations: {enabled: false},
				foreColor: '#111'
			},
			xaxis: {
					type: 'datetime',
				labels: {
					style: { colors: ['#eee'] }
				}
			},
			yaxis: {
					opposite: true,
				tooltip: {
					enabled: true
				},
				labels:{
					align: 'left',
					style: {colors: ['#eee']}
				},
				axisBorder: {
					show: true,
					color: '#eee'
				}
			}
		}
		return (
			<Chart type="candlestick"
				options={options}
				series={[{
					data: stats.candles['ETH/USD']
				}]} />
		)
	}
}
