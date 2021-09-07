import * as React from "react";
import {
    getStrokeDasharrayCanvas,
    strokeDashTypes,
    GenericChartComponent,
		getAxisCanvas
} from "@react-financial-charts/core";
import { line, CurveFactoryLineOnly, CurveFactory } from "d3-shape";
import { Coords } from "../../../../../lambdas/_common/botRunner/botRunPlotter";
import chartUtils from "../chartUtils";

export interface LineProps {
    /**
     * A factory for a curve generator for the line.
     */
    readonly curve?: CurveFactory | CurveFactoryLineOnly;
    /**
     * Click handler.
     */
    readonly onClick?: (e: React.MouseEvent, moreProps: any) => void;
    /**
     * Color, gradient, or pattern to use for the stroke.
     */
    readonly strokeStyle?: string;
    /**
     * Stroke dash.
     */
    readonly strokeDasharray?: strokeDashTypes;
    /**
     * Stroke width.
     */
    readonly strokeWidth?: number;

		points: Coords[]
		name: string
}

/**
 * `Line` component.
 */
export class Line extends React.Component<LineProps> {
	public static defaultProps = {
			strokeDasharray: "Solid",
			strokeStyle: "#2196f3",
			strokeWidth: 2,
	};

	public render() {
			const {
					onClick,
					strokeDasharray,
			} = this.props;

			const lineDash = getStrokeDasharrayCanvas(strokeDasharray);

			return (
					<GenericChartComponent
							canvasDraw={this.drawOnCanvas(lineDash)}
							onClickWhenHover={onClick}
							canvasToDraw={getAxisCanvas}
							drawOn={['pan']}
					/>
			);
	}

	private readonly drawOnCanvas = (lineDash?: number[]) => (ctx: CanvasRenderingContext2D, moreProps: any) => {
			const {
					points,
					curve,
					strokeStyle,
					strokeWidth = Line.defaultProps.strokeWidth,
			} = this.props;

			const {
					xScale,
					chartConfig: { yScale },
					plotData,
			} = moreProps;

			ctx.save();

			ctx.lineWidth = strokeWidth;

			if (strokeStyle !== undefined) {
					ctx.strokeStyle = strokeStyle;
			}

			if (lineDash !== undefined) {
					ctx.setLineDash(lineDash);
			}

			const dataSeries = line()
					.x((d:any) => Math.round(xScale(d.x)))
					.y((d:any) => Math.round(yScale(d.y)));

			if (curve !== undefined) {
					dataSeries.curve(curve);
			}

			const startDate = plotData[0].date;
			const endDate = plotData[plotData.length-1].date;
			const {startIndex, endIndex} = chartUtils.getDrawingIndices( points, startDate, endDate);

			ctx.beginPath();
			dataSeries.context(ctx)(points.slice(startIndex, endIndex));
			ctx.stroke();

			ctx.restore();
	};
}