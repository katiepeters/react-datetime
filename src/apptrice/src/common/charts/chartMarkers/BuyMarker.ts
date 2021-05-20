const { TriangleMarker } = require('react-stockcharts/lib/series');
const { hexToRGBA, functor } = require('react-stockcharts/lib/utils');

function BuyMarker(props: any) {
	return TriangleMarker(props);
}

BuyMarker.drawOnCanvas = (props: any, point: any, ctx: any) => {
	const { stroke, fill, opacity, strokeWidth } = props;
	ctx.strokeStyle = stroke;
	ctx.lineWidth = strokeWidth;
	if (fill !== "none") {
		ctx.fillStyle = hexToRGBA(fill, opacity);
	}
	BuyMarker.drawOnCanvasWithNoStateChange(props, point, ctx);
};

BuyMarker.drawOnCanvasWithNoStateChange = (props: any, point: any, ctx: any) => {

	const { width } = props;
	const w = functor(width)(point.datum);
	const { x, y } = point;
	const { innerOpposite } = getTrianglePoints(w);

	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x + (w / 2), y + (innerOpposite * 3));
	ctx.lineTo(x - (w / 2), y + (innerOpposite * 3));
	ctx.lineTo(x, y);
	ctx.stroke();

	ctx.fill();
};

export default BuyMarker;


function getTrianglePoints(width: number) {
	const innerHypotenuse = (width / 2) * (1 / Math.cos(30 * Math.PI / 180));
	const innerOpposite = (width / 2) * (1 / Math.tan(60 * Math.PI / 180));
	return {
		innerOpposite,
		innerHypotenuse
	};
}