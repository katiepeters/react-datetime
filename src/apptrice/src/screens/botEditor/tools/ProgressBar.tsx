import React from 'react';

interface ProgressBarProps {
	progress: number
}

export default function ProgressBar({progress}: ProgressBarProps) {
	const barStyles = {
		...styles.bar,
		width: `${Math.min( progress, 100 )}%`
	};

	return (
		<div style={styles.wrapper}>
			<div style={barStyles}/>
		</div>
	);
}


const styles: { [id: string]: React.CSSProperties } = {
	wrapper: {
		background: 'rgba(255,255,255,.5)',
		width: '100%',
		height: 5,
		borderRadius: 3,
		overflow: 'hidden'
	},
	bar: {
		background: '#3dc9b0',
		transition: 'width .1s',
		height: 5
	}
}
