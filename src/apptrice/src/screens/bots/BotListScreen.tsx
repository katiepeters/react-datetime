
import { AxiosResponse } from 'axios';
import * as React from 'react'
import { Button, ButtonList, DropDownButton, Modal, ModalBox, ScreenWrapper, Spinner, Table } from '../../components';
import { TableColumn } from '../../components/table/Table';
import Toaster from '../../components/toaster/Toaster';
import apiCacher, { DbBot } from '../../state/apiCacher';
import { ScreenProps } from '../../types'
import BotEditForm, {BotEditPayload} from './BotEditForm';
import botListLoader from './botList.loader';
import styles from './_BotListScreen.module.css';

interface BotListScreenState {
	loadingItems: {[id:string]: boolean},
	createModalOpen: boolean,
	editingBotId?: string
}

export default class BotListScreen extends React.Component<ScreenProps> {
	state: BotListScreenState = {
		loadingItems: {},
		createModalOpen: false,
		editingBotId: undefined
	}

	render() {
		let Subscreen = this.getSubscreen();
		if (Subscreen) {
			return <Subscreen {...this.props} />;
		}

		return (
			<ScreenWrapper title="Bots"
				titleExtra={ this.renderCreateButton() }>
				<div>
					{ this.renderBotList() }
					{ this.renderCreateModal()}
				</div>
			</ScreenWrapper>
		);
	}

	renderBotList() {
		const { authenticatedId: accountId } = this.props.store;
		const { isLoading, data } = botListLoader.getData(accountId);
		if (isLoading || !data) {
			return <span>Loading...</span>;
		}

		return (
			<Table
				data={data || []}
				keyField="id"
				columns={this.getColumns()}
				onRowClick={this._navigateToBot}
				noElementsMessage="No bots yet."
			/>
		);
	}

	renderCreateButton() {
		return (
			<Button size="s"
				onClick={() => this.setState({ createModalOpen: true })}>
				Create new bot
			</Button>
		);
	}

	renderCreateModal() {
		const {createModalOpen, editingBotId} = this.state;
		const isOpen = createModalOpen || editingBotId !== undefined;

		return (
			<Modal open={ isOpen }
				onClose={ this._closeModal }>
				{() => (
					<ModalBox>
						<BotEditForm
							type={ createModalOpen ? 'create' : 'edit' }
							bot={ this.getBot( editingBotId ) }
							onClose={ this._closeModal }
							onSave={ createModalOpen ? this._createBot : this._updateBot } />
					</ModalBox>
				)}
			</Modal>
		)
	}

	getSubscreen(){
		return this.props.router.location.matches[1];
	}

	getBot( botId?: string ){
		if( !botId ) return;

		const { authenticatedId: accountId } = this.props.store;
		const { data } = botListLoader.getData(accountId);
		if( !data ) return;

		return data.find((bot: DbBot) => bot.id === botId);
	}

	getColumns(): TableColumn<DbBot>[] {
		return [
			{ field: 'name', title: 'Bot name' },
			{ field: 'accountId', title: 'Account' },
			{ field: 'controls', title: '', renderFn: this._renderControls, noSort: true}
		]
	}

	_renderControls = (item: DbBot) => {
		if (this.state.loadingItems[item.id]) {
			return <Spinner color="#fff" />;
		}

		let buttons = [
			{ label: 'Edit name', value: 'edit'},
			{ label: 'Delete bot', value: 'delete' }
		];

		return (
			<div onClick={(e:any) => e.stopPropagation()}>
				<DropDownButton closeOnClick={true}>
					<ButtonList buttons={buttons}
						onButtonPress={(action: string) => this._onBotAction(item, action)}
					/>
				</DropDownButton>
			</div>
		);
	}

	_onBotAction = ( bot: DbBot, action: string ) => {
		if( action === 'edit' ){
			return this.setState({editingBotId: bot.id});
		}
		else if( action === 'delete' ){
			return this.deleteBot( bot.id );
		}
	}

	_closeModal = () => {
		this.setState({
			createModalOpen: false,
			editingBotId: undefined
		});
	}

	_navigateToBot = ( bot?: DbBot ) => {
		if( !bot ) return;
		this.props.router.push(`/bots/${bot.id}/editor`);
	}

	_createBot = ({name}: BotEditPayload) => {
		let bot = {
			accountId: this.props.store.authenticatedId,
			name: name,
			code: `
`
		};

		return apiCacher.createBot(bot).then((res: AxiosResponse) => {
			if(!res.data.error) {
				this._closeModal();
				Toaster.show('Bot created, you can edit the code now.', 'success');
				this._navigateToBot( this.getBot(res.data.id) );
			}
			return res;
		})
	}

	_updateBot = ({name}: BotEditPayload) => {
		const {editingBotId = ''} = this.state;
		const {authenticatedId} = this.props.store;

		this.setState({loadingItems: {[editingBotId]: true}});
		return apiCacher.updateBot( authenticatedId, editingBotId, {name} )
			.then(res => {
				this.setState({
					loadingItems: { [editingBotId]: false },
					editingBotId: undefined
				});
				return res;
			})
		;
	}

	deleteBot( botId: string ) {
		this.setState({ loadingItems: { [botId]: true } });
		return apiCacher.deleteBot(this.props.store.authenticatedId, botId)
			.then(res => {
				this.setState({
					loadingItems: {}
				});
				return res;
			})
		;
	}
}
