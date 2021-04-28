import { DBBotDeploymentRaw, DBBotDeployment, DBBotDeploymentInput, DBBotDeploymentUpdate, SimpleBotDeployment } from '../../model.types';
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
		if( !entry ) return entry;

		return {
			...entry,
			active: entry.active ? true : false,
			orders: JSON.parse(entry.orders),
			state: JSON.parse(entry.state)
		};
	},

	async create( deployment: DBBotDeploymentInput ){
		let toStore: DBBotDeploymentRaw = {
			id: deployment.id,
			accountId: deployment.accountId,
			botId: deployment.botId,
			resourceId: `DEPLOYMENT#${deployment.id}`,
			exchangeAccountId: deployment.exchangeAccountId,
			runInterval: deployment.runInterval,
			symbols: deployment.symbols,
			orders: JSON.stringify(deployment.orders),
			state: JSON.stringify(deployment.state || { newState: 'stateNew' })
		};

		if( deployment.active ){
			toStore.active = 'true';
		}
		
		return await Db.put(toStore);
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