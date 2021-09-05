import * as React from "react";
import { GenericChartComponent } from "@react-financial-charts/core";
import { Coords } from "../../../../../lambdas/_common/botRunner/botRunPlotter";
import { SvgPathAnnotation } from '@react-financial-charts/annotations';
import chartUtils from "../chartUtils";

export interface PointSeriesProps {
	name: string
	points: Coords[]
	color: string
}

export class PointSeries extends React.Component<PointSeriesProps> {
	public render() {
			return <GenericChartComponent svgDraw={this.renderSVG} drawOn={["pan"]} />;
	}

	private readonly renderSVG = (moreProps: any) => {
		const {points, color} = this.props;
		const {
			xScale,
			chartConfig: { yScale },
			plotData,
		} = moreProps;

		const startDate = plotData[0].date;
		const endDate = plotData[plotData.length-1].date;

		const {startIndex, endIndex} = chartUtils.getDrawingIndices( points, startDate, endDate);
		if( startIndex === undefined ){
			return <g />;
		}

		const usingProps = {
        fill: color,
        path: () =>
            "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z",
        pathWidth: 12,
        pathHeight: 22,
        tooltip: "Svg Annotation",
        y: ({ yScale, datum }: any) => yScale(datum.y),
    };

		let annotations = [];
		for(let i = startIndex; i<= endIndex; i++ ){
			annotations.push(
				<SvgPathAnnotation
						key={`p${i}`}
						{...usingProps}
						xScale={xScale}
						yScale={yScale}
						xAccessor={(d: Coords) => d.x}
						plotData={plotData}
						datum={ points[i] } />
			);
		}

		return (
			<g>{annotations}</g>
		);
	};

}
