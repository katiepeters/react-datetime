import React, { Component } from 'react';
import { FormCaption, FormErrors } from '../../types';
import mergeStyles from '../../utils/mergeStyles';
import styles from './_InputGroup.module.css';

interface InputGroupProps  {
	name: string,
	label: string,
	caption?: FormCaption
}

export default class InputGroup extends Component<InputGroupProps> {
	render() {
		const { caption } = this.props;

		const labelCn = mergeStyles(
			styles.labelWrapper,
			caption && styles[`text_${caption.type}`]
		);

		return (
			<div>
				<div className={ labelCn }>
					{ this.renderHighlightIcon(caption) }
					<label htmlFor={this.props.name}>
						{this.props.label}:
					</label>
				</div>
				<div className={styles.inputWrapper}>
					{ this.props.children }
				</div>
				{ this.renderCaption(caption) }
			</div>
		);
	}

	renderHighlightIcon(caption?: FormCaption) {
		if (!caption) return;

		let icon: any;
		if( caption.type === 'error' ){
			icon = <span className="fa fa-exclamation-circle" />;
		}
		else if (caption.type === 'warning') {
			icon = <span className="fa fa-exclamation-triangle" />;
		}

		if( icon ){
			return (
				<div className={styles.iconWrapper}>
					{ icon }
				</div>
			)
		}
	}



	renderCaption(caption?: FormCaption) {
		if( !caption ) return;

		let cn = mergeStyles(
			styles.caption,
			styles[`text_${caption.type}`]
		);

		return (
			<div className={cn}>
				{ caption.message }
			</div>
		);
	}
}
