const { OHLCTooltip, ToolTipText, ToolTipTSpanLabel } = require('react-stockcharts/lib/tooltip');


const displayTexts = {
	o: " O: ",
	h: " H: ",
	l: " L: ",
	c: " C: ",
	v: " Vol: ",
	na: "-"
}

export default function OHLC(props: any) {
	return (
		<OHLCTooltip
			{ ...props }
			displayTexts={ displayTexts }
			labelFill="#f390dd"
			textFill="#b2b1d8">
			{ defaultDisplay }
		</OHLCTooltip>
	);
}

function defaultDisplay(props: any, moreProps: any, itemsToDisplay: any ) {

	/* eslint-disable */
	const {
		className,
		textFill,
		labelFill,
		onClick,
		fontFamily,
		fontSize,
		displayTexts
	} = props;
	/* eslint-enable */

	const {
		open,
		high,
		low,
		close,
		volume,
		x,
		y
	} = itemsToDisplay;
	return (
		<g
			className={`react-stockcharts-tooltip-hover ${className}`}
			transform={`translate(${x}, ${y})`}
			onClick={onClick}
		>
			<ToolTipText
				x={0}
				y={0}
				fontFamily={fontFamily}
				fontSize={fontSize}
			>
				<ToolTipTSpanLabel fill={labelFill} key="label_O">{displayTexts.o}</ToolTipTSpanLabel>
				<tspan key="value_O" fill={textFill}>{open}</tspan>
				<ToolTipTSpanLabel fill={labelFill} key="label_H">{displayTexts.h}</ToolTipTSpanLabel>
				<tspan key="value_H" fill={textFill}>{high}</tspan>
				<ToolTipTSpanLabel fill={labelFill} key="label_L">{displayTexts.l}</ToolTipTSpanLabel>
				<tspan key="value_L" fill={textFill}>{low}</tspan>
				<ToolTipTSpanLabel fill={labelFill} key="label_C">{displayTexts.c}</ToolTipTSpanLabel>
				<tspan key="value_C" fill={textFill}>{close}</tspan>
				<ToolTipTSpanLabel fill={labelFill} key="label_Vol">{displayTexts.v}</ToolTipTSpanLabel>
				<tspan key="value_Vol" fill={textFill}>{volume}</tspan>
			</ToolTipText>
		</g>
	);
}
