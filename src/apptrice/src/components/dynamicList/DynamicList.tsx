import * as React from 'react'
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';


interface DynamicListProps {
	items: any,
	renderItem: (item: any) => JSX.Element,
	defaultSize: number
}

interface DynamicListState {
	sizes: {[id: string]: number}
}

export default class DynamicList extends React.Component<DynamicListProps, DynamicListState> {
	state = {
		sizes: {}
	}

	ref = React.createRef<List>()

	render() {
		const {items} = this.props;

		return (
			<AutoSizer>
				{ ({ height, width }) => (
					<List height={height}
						width={width}
						itemCount={items.length}
						itemSize={this._getItemSize}
						ref={this.ref}>
						{ this._renderItem }
					</List>
				)}
			</AutoSizer>
		);
	}

	sizes: { [id: string]: number } = {};
	_getItemSize = (index: number) => {
		let item = this.props.items[index];
		if( !item ) return this.props.defaultSize;

		let id: string = item.id || `it${index}`;

		return this.sizes[id] || this.props.defaultSize;
	}

	_renderItem = ({ index, style }: { index: number, style: any }) => {
		const item = this.props.items[index];

		return (
			<DynamicListItem
				st={style}
				index={index}
				defaultSize={ this.props.defaultSize }
				id={item.id || `it${index}`}
				onResize={ this._onItemResize }>
				{ this.props.renderItem(item) }
			</DynamicListItem>
		)
	}

	_onItemResize = ( id: string, index: number, size: number ) => {
		this.sizes = {
			...this.sizes,
			[id]: size
		}
		this.refresh(index);
	}

	refreshTimeout:any = false;
	minimumIndex: number = Infinity;
	refresh( index: number ) {
		if( this.refreshTimeout ){
			clearTimeout( this.refreshTimeout );
			this.refreshTimeout = false;
		}
		if( index < this.minimumIndex ){
			this.minimumIndex = index;
		}
		this.refreshTimeout = setTimeout( () => {
			// @ts-ignore
			this.ref.current?.resetAfterIndex(this.minimumIndex);
			this.minimumIndex = Infinity;
			this.refreshTimeout = false;
		}, 100);
	}
}

interface DynamicListItemProps {
	id: string,
	index: number,
	defaultSize: number,
	onResize: (id: string, index: number, size: number) => void,
	st: any
}

class DynamicListItem extends React.Component<DynamicListItemProps> {
	ref = React.createRef<HTMLDivElement>();

	render() {
		let st = { ...this.props.st };
		delete st.height;

		return (
			<div ref={this.ref} style={st}>
				{ this.props.children }
			</div>
		);
	}

	componentDidUpdate(){
		this.checkUpdateSize();
	}
	componentDidMount() {
		this.checkUpdateSize();
	}

	size = this.props.defaultSize;
	checkUpdateSize() {
		let nextSize = this.ref.current?.clientHeight;
		if( nextSize && nextSize !== this.size ){
			this.size = nextSize;
			this.props.onResize( this.props.id, this.props.index, nextSize )
		}
	}
}
