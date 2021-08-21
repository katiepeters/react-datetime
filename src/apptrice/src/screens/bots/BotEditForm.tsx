import * as React from 'react'
import { DbBot } from '../../../../lambdas/model.types';
import { Button, Controls, InputGroup } from '../../components';
import Toaster from '../../components/toaster/Toaster';
import { FormErrors } from '../../types';
import styles from './_BotEditForm.module.css';

export interface BotEditPayload {
	name: string
}

interface BotEditFormProps {
	type: 'create' | 'edit'
	bot?: DbBot
	onClose: () => any
	onSave: (exchange: BotEditPayload) => Promise<any>
}

export default class BotEditForm extends React.Component<BotEditFormProps> {
	state = {
		name: this.props.bot ? this.props.bot.name : '',
		errors: {},
		saving: false
	}

	render() {
		const {type} = this.props;
		return (
			<div className={styles.container}>
				<div className={styles.titleWrapper}>
					<h3>
						{ type === 'create' ? 'Create bot' : 'Edit bot'}
					</h3>
				</div>
				<div className={styles.inputWrapper}>
					<InputGroup
						name="name"
						label="Give this bot a name">
						<input name="name"
							value={this.state.name}
							onChange={e => this.setState({ name: e.target.value })} />
					</InputGroup>
				</div>
				<div className={styles.controls}>
					<Controls>
						<Button size="s"
							color="transparent"
							onClick={this.props.onClose}
							disabled={this.state.saving}>
							Cancel
						</Button>
						<Button size="s"
							onClick={this._onCreate}
							loading={this.state.saving}>
							{type === 'create' ? 'Create bot' : 'Save bot'}
						</Button>
					</Controls>
				</div>
			</div>
		)
	}

	_onCreate = () => {
		let errors = this.getValidationErrors();
		this.setState({ errors });
		if (Object.keys(errors).length) {
			return Toaster.show('There are errors in the form');
		}

		const { name } = this.state;
		this.setState({ saving: true });
		this.props.onSave({ name }).then(res => {
			setTimeout(
				() => this.mounted && this.setState({ saving: false }),
				200
			);
		});
	}

	getValidationErrors() {
		let errors: FormErrors = {};

		if (!this.state.name) {
			errors.name = { type: 'error', message: 'Please set a name for the bot.' }
		}

		return errors;
	}

	mounted = true;
	componentWillUnmount() {
		this.mounted = false;
	}
}
