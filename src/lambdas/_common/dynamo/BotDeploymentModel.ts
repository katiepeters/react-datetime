import { DBBotDeploymentRaw, DBBotDeployment, DBBotDeploymentInput, DBBotDeploymentUpdate } from '../../model.types';
import { DBModel } from './db';

const Db = new DBModel<DBBotDeploymentRaw>();

export default {
	async getAccountDeployments( accountId: string ): Promise<DBBotDeployment[]> {
		let deployments = await Db.getMultiple(accountId, 'DEPLOYMENT#');
		return deployments.map( (d: any) => ({
			...d,
			orders: JSON.parse(d.orders),
			state: JSON.parse(d.state)
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
			state: JSON.stringify(deployment.state)
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