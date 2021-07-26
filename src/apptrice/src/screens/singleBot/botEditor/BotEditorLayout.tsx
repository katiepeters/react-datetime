import * as React from 'react';

import styles from './_BotEditorLayout.module.css';
import LayoutContext from './BotEditorLayoutContext';

const MIN_SIDE_SIZE = 34;
const MIN_BOTTOM_SIZE = 34;
const LS_LAYOUT_KEY = 'BOT_EDITOR_LAYOUT';

interface BotEditorLayoutProps {
	mainTop: any,
	mainBottom: any,
	side: any
}

export default class BotEditorLayout extends React.Component<BotEditorLayoutProps> {
	state = {
		bottomSize: this.getInitialBottomSize(),
		bottomOffset: 0,
		sideSize: this.getInitialSideSize(),
		sideOffset: 0,
		bottomOrigin: 0,
		bottomCaptured: false,
		sideOrigin: 0,
		sideCaptured: false
	}

	render() {
		return (
			<LayoutContext.Provider value={ this._getHandlers() }>
				<div className={styles.layout}>
					<div className={styles.main}>
						<div className={styles.mainTop}>
							{ this.props.mainTop }
						</div>
						<div className={styles.mainBottom} style={{height: Math.max(MIN_BOTTOM_SIZE, this.state.bottomSize + this.state.bottomOffset) }}>
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
		this.moveHandler(e, 'side', e.clientX);
	}

	_bottomDownHandler = (e: MouseEvent) => {
		this.setState({
			bottomOrigin: e.clientY,
			bottomCaptured: false
		});
		document.addEventListener('mousemove', this._bottomMoveHandler);
		document.addEventListener('mouseup', this._bottomUpHandler);
	}

	_bottomUpHandler = (e: MouseEvent) => {
		this.upHandler('bottom', e.clientY);
		document.removeEventListener('mousemove', this._bottomMoveHandler);
		document.removeEventListener('mouseup', this._bottomUpHandler);
	}

	_bottomMoveHandler = (e: MouseEvent) => {
		this.moveHandler(e, 'bottom', e.clientY);
	}

	moveHandler( e: MouseEvent, type: string, coord: number ) {
		const origin = type === 'side' ? this.state.sideOrigin : this.state.bottomOrigin;
		const captured = type === 'side' ? this.state.sideCaptured : this.state.bottomCaptured;

		const offset = origin - coord;
		if( captured ){
			e.preventDefault();
			this.setState({
				[`${type}Offset`]: offset
			});
		}
		else if( offset > 5 || offset < 5 ){
			e.preventDefault();
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
			const update = {
				[`${type}Captured`]: false,
				[`${type}Size`]: Math.max(size + offset, minSize),
				[`${type}Offset`]: 0
			}
			console.log(update);
			this.setState(update);
		}

		this.saveLayout(type, size + offset);
	}

	getInitialBottomSize() {
		let maxHeight = window.innerHeight / 2;
		let layout = this.loadLayout();
		return Math.min( layout.bottomSize, maxHeight );
	}

	getInitialSideSize() {
		let maxWidth = window.innerWidth / 3;
		let layout = this.loadLayout();
		return Math.min( layout.sideSize, maxWidth );
	}

	saveLayout( type: string, size: number) {
		let sizes: any = this.loadLayout();
		if( type === 'side' ){
			sizes.sideSize = size;
		}
		else {
			sizes.bottomSize = size;
		}
		
		localStorage.setItem(LS_LAYOUT_KEY, JSON.stringify(sizes));
	}

	loadLayout() {
		const saved = localStorage.getItem(LS_LAYOUT_KEY);
		return saved ?
			JSON.parse( saved ) : 
			{sideSize: 150, bottomSize: 150 }
		;
	}
}
