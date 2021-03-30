import React, { Component } from 'react'

interface InputGroupProps  {
	name: string,
	label: string
}

export default class InputGroup extends Component<InputGroupProps> {
	render() {
		return (
			<div>
				<div style={ styles.labelWrapper }>
					<label htmlFor={this.props.name}>
						{this.props.label}:
					</label>
				</div>
				<div style={styles.inputWrapper}>
					{ this.props.children }
				</div>
			</div>
		);
	}
}

const styles: {[id:string]: React.CSSProperties} = {
	labelWrapper: {
		marginBottom: 4
	},
	inputWrapper: {
		display: 'flex',
		width: '100%',
		flexDirection: 'column',
		alignItems: 'stretch'
	},
}

