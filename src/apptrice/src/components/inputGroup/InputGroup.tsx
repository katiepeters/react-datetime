import React, { Component } from 'react';
import styles from './_InputGroup.module.css';

interface InputGroupProps  {
	name: string,
	label: string
}

export default class InputGroup extends Component<InputGroupProps> {
	render() {
		return (
			<div>
				<div className={ styles.labelWrapper }>
					<label htmlFor={this.props.name}>
						{this.props.label}:
					</label>
				</div>
				<div className={styles.inputWrapper}>
					{ this.props.children }
				</div>
			</div>
		);
	}
}
