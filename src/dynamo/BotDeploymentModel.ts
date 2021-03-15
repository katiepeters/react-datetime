import { TableItem, DBModel } from './db';
import {Orders} from '../runner/Trader';

interface DBBotDeploymentConfig {
	exchangeAccountId: string
	symbols: string[]
}

interface DBBotDeploymentState {
	[attribute: string]: any
}

interface DBBotDeployment extends TableItem {
	orders: Orders
	config: DBBotDeploymentConfig
	state: DBBotDeploymentState
}

interface DBBotDeploymentRaw extends TableItem {
	config: DBBotDeploymentConfig
	data: string
}

interface DBBotDeploymentInput {
	accountId: string
	botDeploymentId: string
	config: DBBotDeploymentConfig
	orders: Orders
	state: DBBotDeploymentState
}

const Db = new DBModel<DBBotDeploymentRaw>();

export default {
	async getSingle(accountId: string, resourceId: string): Promise<DBBotDeployment | void> {
		let entry = await Db.getSingle(accountId, resourceId);
		if( !entry ) return entry;

		return {
			...entry,
			...JSON.parse(entry.data)
		};
	},

	async create( deployment: DBBotDeploymentInput ){
		let toStore = {
			accountId: deployment.accountId,
			resourceId: `EXCHANGE#${deployment.botDeploymentId}`,
			config: deployment.config,
			data: JSON.stringify({
				exchangeAccountId: deployment.orders,
				state: deployment.state
			})
		};
		
		return await Db.put(toStore);
	},

	async update( deployment: DBBotDeploymentInput ){
		return await this.create(deployment);
	}
}