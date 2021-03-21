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
	[orderId: string]: Order
}


interface DBBotDeploymentConfig {
	exchangeAccountId: string
	symbols: string[]
}

interface DBBotDeploymentState {
	[attribute: string]: any
}

interface DBBotDeployment extends TableItem {
	id: string
	orders: Orders
	config: DBBotDeploymentConfig
	state: DBBotDeploymentState
}

interface DBBotDeploymentRaw extends TableItem {
	id: string
	config: DBBotDeploymentConfig
	data: string
}

interface DBBotDeploymentInput {
	accountId: string
	id: string
	config: DBBotDeploymentConfig
	orders: Orders
	state: DBBotDeploymentState
}

interface OrderInput {
	symbol: string
	type: 'limit' | 'market'
	direction: 'buy' | 'sell'
	amount: number
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
			id: deployment.id,
			accountId: deployment.accountId,
			resourceId: `EXCHANGE#${deployment.id}`,
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