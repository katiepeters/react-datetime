import { DBBotDeploymentRaw, DBBotDeployment, DBBotDeploymentInput, DBBotDeploymentUpdate, SimpleBotDeployment } from '../../model.types';
import s3Helper from '../utils/s3';
import { DBModel } from './db';

const Db = new DBModel<DBBotDeploymentRaw>();

interface DeleteDeploymentInput {
	accountId: string
	deploymentId: string
}

interface UpdateDeploymentInput {
	accountId: string
	deploymentId: string
	update: DBBotDeploymentUpdate
}

export default {
	async getAccountDeployments( accountId: string ): Promise<SimpleBotDeployment[]> {
		let deployments = await Db.getMultiple(accountId, 'DEPLOYMENT#');
		return deployments.map( (d: any) => ({
			id: d.id,
			accountId,
			config: d.config,
			botId: d.botId,
			active: d.active === 'true' ? true : false
		}));
	},

	async getSingle(accountId: string, deploymentId: string): Promise<DBBotDeployment | void> {
		let entry = await Db.getSingle(accountId, `DEPLOYMENT#${deploymentId}`);
		if( !entry ) return;

		let [ logs, state, orders ] = await Promise.all([
			getLogs(accountId, deploymentId),
			getState(accountId, deploymentId),
			getOrders(accountId, deploymentId)
		]);

		return {
			...entry,
			active: entry.active ? true : false,
			orders: JSON.parse(orders),
			state: JSON.parse(state),
			logs: JSON.parse(logs)
		};
	},

	async create( input: DBBotDeploymentInput ){
		const {id: deploymentId, accountId } = input;
		let dbDeployment: DBBotDeploymentRaw = {
			id: deploymentId,
			accountId,
			botId: input.botId,
			resourceId: `DEPLOYMENT#${input.id}`,
			exchangeAccountId: input.exchangeAccountId,
			runInterval: input.runInterval,
			symbols: input.symbols
		};

		if( input.active ){
			dbDeployment.active = 'true';
		}

		const defaultOrders = {
			foreignIdIndex: {},
			items: {},
			openOrderIds: []
		};

		return await Promise.all([
			Db.put(dbDeployment),
			saveLogs(accountId, deploymentId, JSON.stringify(input.logs || [])),
			saveState(accountId, deploymentId, JSON.stringify(input.state || [])),
			saveOrders(accountId, deploymentId, JSON.stringify(input.orders || defaultOrders)),
		]);
	},

	async update({ accountId, deploymentId, update }: UpdateDeploymentInput ){
		let rawUpdate:any = {...update};
		if( rawUpdate.state ){
			rawUpdate.state = JSON.stringify(rawUpdate.state);
		}
		if (rawUpdate.orders) {
			rawUpdate.orders = JSON.stringify(rawUpdate.orders);
		}
		return await Db.update(accountId, `DEPLOYMENT#${deploymentId}`, rawUpdate);
	},

	async delete({accountId, deploymentId}: DeleteDeploymentInput) {
		return await Db.del(accountId, `DEPLOYMENT#${deploymentId}`);
	},

	async getActiveDeployments( runInterval: string ) {
		return await Db.getIndex('ActiveDeployments').getMultiple({
			pk: {name: 'runInterval', value: runInterval},
			sk: {name: 'active', value: 'true'}
		});
	},

	async deactivate({ accountId, deploymentId }: DeleteDeploymentInput ) {
		return await Db.removeAttributes(accountId, `DEPLOYMENT#${deploymentId}`, ['active']);
	},

	async activate({ accountId, deploymentId }: DeleteDeploymentInput) {
		return await Db.update(accountId, `DEPLOYMENT#${deploymentId}`, {active: 'true'});
	},
}

function getLogsFileName( accountId: string, deploymentId: string ){
	return `${accountId}/${deploymentId}/logs`;
}
function getStateFileName(accountId: string, deploymentId: string) {
	return `${accountId}/${deploymentId}/state`;
}
function getOrdersFileName(accountId: string, deploymentId: string) {
	return `${accountId}/${deploymentId}/orders`;
}

function getLogs( accountId: string, deploymentId: string ){
	return s3Helper.getContent( getLogsFileName(accountId, deploymentId) );
}
function getState(accountId: string, deploymentId: string) {
	return s3Helper.getContent(getStateFileName(accountId, deploymentId));
} 
function getOrders(accountId: string, deploymentId: string) {
	return s3Helper.getContent(getOrdersFileName(accountId, deploymentId));
}

function saveLogs(accountId: string, deploymentId: string, logs: string) {
	return s3Helper.setContent(getLogsFileName(accountId, deploymentId), logs);
}
function saveState(accountId: string, deploymentId: string, state: string) {
	return s3Helper.setContent(getStateFileName(accountId, deploymentId), state);
}
function saveOrders(accountId: string, deploymentId: string, orders: string) {
	return s3Helper.setContent(getOrdersFileName(accountId, deploymentId), orders);
}