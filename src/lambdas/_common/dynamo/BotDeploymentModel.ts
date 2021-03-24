import { TableItem, DBModel } from './db';

interface Order extends OrderInput {
	id: string
	foreignId: string | null
	status: 'pending' | 'placed' | 'completed' | 'cancelled' | 'error'
	errorReason: string | null
	price: number | null
	executedPrice: number | null
	createdAt: number
	placedAt: number | null
	closedAt: number | null
}

interface Orders {
	foreignIdIndex: {[foreignId: string]: string}
	items: {[orderId: string]: Order}
}

interface DBBotDeploymentConfig {
	exchangeAccountId: string
	exchangeType: string
	interval: '5m' | '10m' | '30m' | '1h' | '4h' | '1d'
	symbols: string[]
}

interface DBBotDeploymentState {
	[attribute: string]: any
}

interface DBBotDeployment extends TableItem {
	id: string
	botId: string
	orders: Orders
	config: DBBotDeploymentConfig
	state: DBBotDeploymentState
}

interface DBBotDeploymentRaw extends TableItem {
	id: string
	botId: string
	config: DBBotDeploymentConfig
	orders: string
	state: string
}

interface DBBotDeploymentInput {
	accountId: string
	id: string
	botId: string
	config: DBBotDeploymentConfig
	orders: Orders
	state: DBBotDeploymentState
}

interface DBBotDeploymentUpdate {
	botId?: string
	config?: DBBotDeploymentConfig
	orders?: Orders
	state?: DBBotDeploymentState
}

interface OrderInput {
	symbol: string
	type: 'limit' | 'market'
	direction: 'buy' | 'sell'
	amount: number
}

const Db = new DBModel<DBBotDeploymentRaw>();

export default {
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