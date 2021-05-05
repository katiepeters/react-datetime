import * as React from 'react'
import styles from './_ButtonList.module.css';

interface ButtonListAction {
	label: string,
	value: any
}

interface ButtonListProps {
	buttons: ButtonListAction[],
	onButtonPress: (value: any) => any
}

export default class ButtonList extends React.Component<ButtonListProps> {
	render() {
		return (
			<div className={styles.container}>
				{ this.props.buttons.map( this._renderButton ) }
			</div>
		);
	}

	_renderButton = (action: ButtonListAction) => {
		return (
			<button className={styles.button}
				onClick={ () => this.props.onButtonPress(action.value) }>
				{ action.label }
			</button>
		);
	}
}
