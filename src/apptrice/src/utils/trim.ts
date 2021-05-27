
export default function trim( n: number, dec: number = 2) {
	let parts = String(n).split('.');
	if( parts.length === 1 ){
		return parts[0];
	}

	return `${parts[0]}.${parts[1].slice(0,dec)}`;
}