import * as React from 'react'
import styles from './_CanvasChart.module.css';

interface CanvasChartProps {
	width: number,
	height: number,
	ratio: number
}

export default class CanvasChart extends React.Component<CanvasChartProps> {
	canvases = {
		bg: React.createRef<HTMLCanvasElement>(),
		axes: React.createRef<HTMLCanvasElement>(),
		coords: React.createRef<HTMLCanvasElement>()
	}

	state = {
		top: 0,
		left: 0,
		xScale: 1,
		yScale: 1
	}

	render() {
		return (
			<div className={styles.container}>
				{ this.renderCanvases() }
				{ this.renderSVGOverlay() }
			</div>
		)
	}

	renderCanvases() {
		const { width, height, ratio } = this.props;
		const canvasWidth = width * ratio;
		const canvasHeight = height * ratio;
		const styles: React.CSSProperties = {position: 'absolute', width, height, zIndex: 1};

		return (
			<>
				<canvas id="bg"
					ref={this.canvases.bg}
					width={canvasWidth}
					height={canvasHeight}
					style={styles} />
				<canvas id="axes"
					ref={this.canvases.axes}
					width={canvasWidth}
					height={canvasHeight}
					style={styles} />
				<canvas id="coords"
					ref={this.canvases.coords}
					width={canvasWidth}
					height={canvasHeight}
					style={styles} />
			</>
		)
	}

	renderSVGOverlay(){
		const { width, height } = this.props;
		return (
			<svg width={width} height={height} style={{position: 'absolute', zIndex: 2}}>

			</svg>
		)
	}
}
