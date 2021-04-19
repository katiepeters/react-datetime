import * as React from 'react'

export default class Menu extends React.Component {
	render() {
		return (
			<div style={styles.menu}>
				<div>
					<a>Deployments</a>
				</div>
				<div>
					<a href="#/bots">Bots</a>
				</div>
			</div>
		)
	}
}


const styles = {
	menu: {
		display: 'flex',
		flexGrow: 1,
		backgroundColor: '#122e44',
		width: 200
	},
	menuItem: {
		backgroundColor: '#555'
	}
}