import * as React from 'react'
import { Button, InputGroup } from '../../components';
import styles from './_CreateExchangeForm.module.css';

interface CreateExchangeFormProps {
}

export default class CreateExchangeForm extends React.Component<CreateExchangeFormProps> {
	state = {
		name: '',
		provider: 'bitfinex',
		key: '',
		secret: ''
	}
	render() {
		return (
			<div className={styles.container}>
				<div className={styles.titleWrapper}>
					<h3>Link exchange</h3>
				</div>
				<div className={styles.inputWrapper}>
					<InputGroup
						name="name"
						label="Give this account a name">
						<input name="name"
							value={this.state.name}
							onChange={e => this.setState({ name: e.target.value })} />
					</InputGroup>
				</div>
				<div className={styles.inputWrapper}>
					<InputGroup
						name="provider"
						label="Select a exchange">
						<select name="provider"
							value={this.state.provider}
							onChange={e => this.setState({ provider: e.target.value })}>
								<option value="bitfinex">Bitfinex</option>
						</select>
					</InputGroup>
				</div>
				<div className={styles.inputWrapper}>
					<InputGroup
						name="key"
						label="API key">
						<input name="key"
							value={this.state.key}
							onChange={e => this.setState({ key: e.target.value })} />
					</InputGroup>
				</div>
				<div className={styles.inputWrapper}>
					<InputGroup
						name="secret"
						label="API secret">
						<input name="secret"
							value={this.state.secret}
							onChange={e => this.setState({ secret: e.target.value })} />
					</InputGroup>
				</div>
				<div className={styles.controls}>
					<Button size="s" color="transparent">
						Cancel
					</Button>
					<Button size="s">
						Link exchange
					</Button>
				</div>
			</div>
		)
	}
}
