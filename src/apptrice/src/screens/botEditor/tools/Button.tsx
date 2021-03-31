import * as React from 'react'

interface ButtonProps {
	onClick?: (e: any) => void
}

export default class Button extends React.Component<ButtonProps> {
	render() {
		return (
			<button style={styles.green} onClick={ this.props.onClick }>
				{ this.props.children }
			</button>
		)
	}
}


const styles: { [id: string]: React.CSSProperties } = {
	green: {
		background: '#3dc9b0',
		cursor: 'pointer',
		color: '#fff',
		border: '2px solid rgba(0,0,0,.1)',
		borderRadius: 5,
		height: 42,
		fontFamily: 'Sarabun, sans-serif',
		fontSize: 17,
		textShadow: '2px 2px rgba(0,0,0,.1)',
		paddingBottom: 4
	}
}