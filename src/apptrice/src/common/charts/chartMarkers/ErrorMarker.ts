const { TriangleMarker } = require('react-stockcharts/lib/series');
const { hexToRGBA, functor } = require('react-stockcharts/lib/utils');

function ErrorMarker(props: any) {
	return TriangleMarker(props);
}

ErrorMarker.drawOnCanvas = (props: any, point: any, ctx: any) => {
	const { stroke, fill, opacity, strokeWidth } = props;
	ctx.strokeStyle = stroke;
	ctx.lineWidth = strokeWidth;
	if (fill !== "none") {
		ctx.fillStyle = hexToRGBA(fill, opacity);
	}
	ErrorMarker.drawOnCanvasWithNoStateChange(props, point, ctx);
};

ErrorMarker.drawOnCanvasWithNoStateChange = (props: any, point: any, ctx: any) => {

	const { width } = props;
	const w = functor(width)(point.datum);
	const { x, y } = point;

	ctx.beginPath();
	ctx.moveTo(x - (w / 2), y - (w/2) );
	ctx.lineTo(x + (w / 2), y + (w / 2));
	ctx.stroke();

	ctx.moveTo(x - (w / 2), y + (w / 2));
	ctx.lineTo(x + (w / 2), y - (w / 2));
	ctx.stroke();

	ctx.fill();
};

export default ErrorMarker;

/*
function getTrianglePoints(width: number) {
	const innerHypotenuse = (width / 2) * (1 / Math.cos(30 * Math.PI / 180));
	const innerOpposite = (width / 2) * (1 / Math.tan(60 * Math.PI / 180));
	return {
		innerOpposite,
		innerHypotenuse
	};
}
*/