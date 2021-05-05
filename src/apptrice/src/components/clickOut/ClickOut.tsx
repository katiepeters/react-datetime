import * as React from 'react'
import onClickOutside from "react-onclickoutside"

interface ClickOutProps {
	onClickout: () => any
}

class ClickOutWrapper extends React.Component<ClickOutProps> {
	handleClickOutside = this.props.onClickout
	render() {
		return this.props.children;
	}
}

const ClickOut = onClickOutside(ClickOutWrapper)

export default ClickOut;


