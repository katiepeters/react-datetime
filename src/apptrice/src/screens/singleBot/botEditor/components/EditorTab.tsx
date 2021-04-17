import * as React from 'react'
import mergeStyles from '../../../../utils/mergeStyles';
import styles from './_EditorTab.module.css';

interface EditorTabProps {
	id: string
	active: boolean
	onClick: (id: string) => void
}

export default class EditorTab extends React.Component<EditorTabProps> {
	render() {
		const cn = mergeStyles(
			styles.container,
			this.props.active && styles.active
		);

		return (
			<button className={cn} onClick={ this._onClick }>
				{this.props.children}
			</button>
		)
	}

	_onClick = () =>{
		this.props.onClick(this.props.id);
	}
}
