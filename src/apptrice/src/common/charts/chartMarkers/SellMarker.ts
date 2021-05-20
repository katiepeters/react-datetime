const { TriangleMarker } = require('react-stockcharts/lib/series');
const { hexToRGBA, functor } = require('react-stockcharts/lib/utils');

function SellMarker( props: any ){
	return TriangleMarker(props);
}

SellMarker.drawOnCanvas = (props: any, point: any, ctx: any) => {
	const { stroke, fill, opacity, strokeWidth } = props;
	ctx.strokeStyle = stroke;
	ctx.lineWidth = strokeWidth;
	if (fill !== "none") {
		ctx.fillStyle = hexToRGBA(fill, opacity);
	}
	SellMarker.drawOnCanvasWithNoStateChange(props, point, ctx);
};

SellMarker.drawOnCanvasWithNoStateChange = (props: any, point: any, ctx:any) => {

	const { width } = props;
	const w = functor(width)(point.datum);
	const { x, y } = point;
	const { innerOpposite } = getTrianglePoints(w);

	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x + (w / 2), y - (innerOpposite*3));
	ctx.lineTo(x - (w / 2), y - (innerOpposite*3));
	ctx.lineTo(x, y);
	ctx.stroke();

	ctx.fill();
};

export default SellMarker;


function getTrianglePoints(width: number) {
	const innerHypotenuse = (width / 2) * (1 / Math.cos(30 * Math.PI / 180));
	const innerOpposite = (width / 2) * (1 / Math.tan(60 * Math.PI / 180));
	return {
		innerOpposite,
		innerHypotenuse
	};
}