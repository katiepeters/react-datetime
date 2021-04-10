export default function mergeStyles( ...args: any[] ): string{
	let classNames: string[] = [];
	args.forEach( cn => cn && classNames.push(cn) );
	return classNames.join(' ');
}