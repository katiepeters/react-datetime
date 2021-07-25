import * as React from 'react';

import styles from './_BotEditorScreen.module.css';
import LayoutContext from './BotEditorLayoutContext';

const MIN_SIDE_SIZE = 34;
const MIN_BOTTOM_SIZE = 34;

interface BotEditorLayoutProps {
	mainTop: any,
	mainBottom: any,
	side: any
}

export default class BotEditorLayout extends React.Component<BotEditorLayoutProps> {

	state = {
		bottomSize: 34,
		bottomOffset: 0,
		sideSize: 34,
		sideOffset: 0,
		bottomOrigin: 0,
		bottomCaptured: false,
		sideOrigin: 0,
		sideCaptured: false
	}

	render() {
		return (
			<LayoutContext.Provider value={ this._getHandlers }>
				<div className={styles.layout}>
					<div className={styles.main}>
						<div className={styles.mainTop}>
							{ this.props.mainTop }
						</div>
						<div className={styles.mainBottom} style={{height: this.state.bottomSize}}>
							{ this.props.mainBottom }
						</div>
					</div>
					<div className={styles.side} style={{height: this.state.sideSize}}>
						{ this.props.side }
					</div>
				</div>
			</LayoutContext.Provider>
		);
	}

	_getHandlers = () => {
		return {
			sideHandlers: {
				onMouseDown: this._sideDownHandler
			},
			bottomHandlers: {
				onMouseDown: this._bottomDownHandler
			}
		};
	}

	_sideDownHandler = (e: MouseEvent) => {
		this.setState({
			sideOrigin: e.x,
			sideCaptured: false
		});
		document.addEventListener('mousemove', this._sideMoveHandler);
		document.addEventListener('mouseup', this._sideUpHandler);
	}

	_sideUpHandler = (e: MouseEvent) => {
		this.upHandler('side', e.y);
		document.addEventListener('mousemove', this._sideMoveHandler);
		document.addEventListener('mouseup', this._sideUpHandler);
	}

	_sideMoveHandler = (e: MouseEvent) => {
		this.moveHandler('side', e.x);
	}

	_bottomDownHandler = (e: MouseEvent) => {
		this.setState({
			bottomOrigin: e.y,
			bottomCaptured: false
		});
		document.addEventListener('mousemove', this._bottomMoveHandler);
		document.addEventListener('mouseup', this._bottomUpHandler);
	}

	_bottomUpHandler = (e: MouseEvent) => {
		this.upHandler('bottom', e.y);
		document.removeEventListener('mousemove', this._bottomMoveHandler);
		document.removeEventListener('mouseup', this._bottomUpHandler);
	}

	_bottomMoveHandler = (e: MouseEvent) => {
		this.moveHandler('bottom', e.x);
	}

	moveHandler( type: string, coord: number ) {
		const origin = type === 'side' ? this.state.sideOrigin : this.state.bottomOrigin;
		const captured = type === 'side' ? this.state.sideCaptured : this.state.bottomCaptured;

		const offset = origin - coord;
		if( captured ){
			this.setState({
				[`${type}Offset`]: offset
			});
		}
		else if( offset > 5 || offset < 5 ){
			this.setState({
				[`${type}Captured`]: true,
				[`${type}Offset`]: offset
			});
		}
	}

	upHandler( type: string, coord: number ) {
		const state = this.state;
		let origin, captured, size, minSize;
		
		if( type === 'side' ){
			origin = state.sideOrigin;
			captured = state.sideCaptured;
			size = state.sideSize;
			minSize = MIN_SIDE_SIZE;
		}
		else {
			origin = state.bottomOrigin;
			captured = state.bottomCaptured;
			size = state.bottomSize;
			minSize = MIN_BOTTOM_SIZE;
		}
		
		const offset = origin - coord;

		if( captured || Math.abs(offset) > 5 ){
			this.setState({
				[`${type}Captured`]: false,
				[`${type}Size`]: Math.max(size + offset, minSize),
				[`${type}Offset`]: 0
			});
		}
	}

}
