import { DbBot, DBBotDeploymentWithHistory, DbBotVersion, DbExchangeAccount, SimpleBotDeployment } from '../../../lambdas/model.types';
import lorese from './Lorese';

export interface StoreAccount {
	id: string,
	bots?: string[],
	deployments?: string[],
	exchangeAccounts?: string[]
}

export type StoreBotDeployment = SimpleBotDeployment | DBBotDeploymentWithHistory;
export interface Store {
	authenticatedId: string
	accounts: {
		[id: string]: StoreAccount
	},
	deployments: {
		[id: string]: StoreBotDeployment
	},
	bots: {
		[id:string]: DbBot
	},
	exchangeAccounts: {
		[id:string]: DbExchangeAccount
	},
	botVersions: {
		[id:string]: Partial<DbBotVersion>
	},
	transientData: {
		currentBt: any,
		candles: any
	}
}

const manager = lorese<Store>({
	authenticatedId: 'testAccount',
	accounts: {
		testAccount: {id: 'testAccount'} 
	},
	deployments: {},
	bots: {},
	exchangeAccounts: {},
	botVersions: {},
	transientData: {
		candles: {},
		currentBt: null
	}
})

export default manager