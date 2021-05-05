import * as React from 'react'
import mergeStyles from '../../utils/mergeStyles';
import styles from './_Table.module.css'
import memoize from 'memoize-one';

export interface TableColumn<T> {
	field: string,
	title?: string
	renderFn?: (item: T, field: string) => JSX.Element
	sortFn?: (a: T, b: T) => number
	noSort?: boolean
}

interface TableProps<T> {
	data: T[]
	keyField?: string
	columns?: TableColumn<T>[]
	defaultSortColumn?: string
	defaultOrder?: number
	noElementsMessage?: string
	showHeader?: boolean
	filterFn?: (item: T) => boolean
	onRowClick?: (item: T) => any
}

class Table<T> extends React.Component<TableProps<T>> {
	static defaultProps = {
		showHeader: true
	}

	state = {
		order: this.props.defaultOrder || 1,
		sortBy: this.props.defaultSortColumn || 'id',
	}

	render() {
		return (
			<table cellSpacing={0} cellPadding={0}>
				{this.renderHeader()}
				{this.renderBody()}
			</table>
		);
	}

	renderHeader() {
		if (!this.props.showHeader || !this.props.data.length ) return;

		return (
			<thead className={styles.thead}>
				<tr className={styles.headRow}>
					{ this.getColumns().map( this._renderHeadCell )}
				</tr>
			</thead>
		);
	}

	_renderHeadCell = ( column: TableColumn<T> ) => {
		let st = mergeStyles(
			styles.headCell,
			column.noSort && styles.headCellNotSortable
		);

		return (
			<th className={st} onClick={() => this.sortByColumn(column)}>
				{ column.title || column.field } { this.renderSortIcon(column.field) }
			</th>
		);
	}

	renderSortIcon( field: string ){
		if( this.state.sortBy !== field ) return;

		return this.state.order === 1 ?
			<span className="fa fa-caret-down" /> :
			<span className="fa fa-caret-up" />
		;
	}

	renderBody() {
		let items = this.filterAndSort();

		if( !items.length ){
			this.renderNoItems();
		}

		return (
			<tbody>
				{ items.map( this._renderRow ) }
			</tbody>
		)
	}

	_renderRow = ( item: T ) => {
		let columns = this.getColumns();
		let st = mergeStyles(
			styles.row,
			this.props.onRowClick && styles.rowClickable
		);

		return (
			<tr className={st}
				onClick={ () => this.onRowClick(item) }
				key={ 
					// @ts-ignore
					item[ this.props.keyField || 'id']
				}>
				{ columns.map( (column: TableColumn<T>) => this.renderCell(item, column) ) }
			</tr>
		);
	}

	renderCell( item: T, column: TableColumn<T>) {
		return (
			<td className={styles.cell}>
				{ // @ts-ignore
					column.renderFn ? column.renderFn(item, column.field) : item[column.field]
				}
			</td>
		);
	}

	renderNoItems(){
		return (
			<div className={styles.noItems}>
				{ this.props.noElementsMessage || 'No items'}
			</div>
		);
	}

	getColumns(): TableColumn<T>[] {
		let {columns, data} = this.props;
		if( columns ) return columns;

		return Object.keys( data[0] )
			.map( (field:string) => ({field}) )
		;
	}

	sortByColumn( column: TableColumn<T> ) {
		if( column.noSort ) return;

		if( column.field === this.state.sortBy ){
			this.setState({
				order: this.state.order === 1 ? -1 : 1
			});
		}
		else {
			this.setState({
				sortBy: column.field,
				order: 1
			});
		}
	}

	filterAndSort() {
		let { data, filterFn } = this.props;
		let { sortBy, order } = this.state;
		let column = this.getColumns().find(column => column.field === sortBy);
		let sortFn = column?.sortFn || this.defaultSortFn(sortBy);

		return filterAndSortMemo( data, filterFn, sortFn, order );
	}

	sortFnCache: { [field: string]: (a: T, b: T) => number } = {};
	defaultSortFn(field: string) {
		let sortFn = this.sortFnCache[field];
		if (!sortFn) {
			sortFn = function (a: T, b: T) {
				// @ts-ignore
				return a[field] > b[field] ? -1 : 1;
			}
			this.sortFnCache[field] = sortFn;
		}
		return sortFn;
	}

	onRowClick( item: T ) {
		if( this.props.onRowClick ){
			this.props.onRowClick(item);
		}
	}
}

export default Table;


const filterAndSortMemo = memoize( (data, filterFn, sortFn, order) => {
	let filtered = [...data];
	if( filterFn ){
		filtered = filtered.filter(filterFn);
	}

	let sortFnWithDirection = sortFn;
	if( order === -1 ){
		sortFnWithDirection = (a:any, b:any) => sortFn(a,b) * (-1);
	}

	return filtered.sort( sortFnWithDirection );
});