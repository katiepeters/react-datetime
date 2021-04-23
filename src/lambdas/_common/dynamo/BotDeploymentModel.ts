import { DBBotDeploymentRaw, DBBotDeployment, DBBotDeploymentInput, DBBotDeploymentUpdate, SimpleBotDeployment } from '../../model.types';
import { DBModel } from './db';

const Db = new DBModel<DBBotDeploymentRaw>();

export default {
	async getAccountDeployments( accountId: string ): Promise<SimpleBotDeployment[]> {
		let deployments = await Db.getMultiple(accountId, 'DEPLOYMENT#');
		return deployments.map( (d: any) => ({
			id: d.id,
			accountId,
			config: d.config,
			botId: d.botId,
			active: d.active || false
		}));
	},

	async getSingle(accountId: string, deploymentId: string): Promise<DBBotDeployment | void> {
		let entry = await Db.getSingle(accountId, `DEPLOYMENT#${deploymentId}`);
		if( !entry ) return entry;

		return {
			...entry,
			orders: JSON.parse(entry.orders),
			state: JSON.parse(entry.state)
		};
	},

	async create( deployment: DBBotDeploymentInput ){
		let toStore = {
			id: deployment.id,
			accountId: deployment.accountId,
			botId: deployment.botId,
			resourceId: `DEPLOYMENT#${deployment.id}`,
			config: deployment.config,
			orders: JSON.stringify(deployment.orders),
			state: JSON.stringify(deployment.state),
			active: deployment.active
		};
		
		return await Db.put(toStore);
	},

	async update(accountId: string, deploymentId: string, update: DBBotDeploymentUpdate ){

		let rawUpdate:any = {...update};
		if( rawUpdate.state ){
			rawUpdate.state = JSON.stringify(rawUpdate.state);
		}
		if (rawUpdate.orders) {
			rawUpdate.orders = JSON.stringify(rawUpdate.orders);
		}
		return await Db.update(accountId, `DEPLOYMENT#${deploymentId}`, rawUpdate);
	}
}