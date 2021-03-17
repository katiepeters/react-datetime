import * as React from 'react'

export default class Menu extends React.Component {
	render() {
		return (
			<div style={styles.menu}>
				<div>
					<a>Deployments</a>
				</div>
				<div>
					<a>Bots</a>
				</div>
			</div>
		)
	}
}


const styles = {
	menu: {
		backgroundColor: '#102433',
		width: 200
	},
	menuItem: {
		backgroundColor: '#555'
	}
}