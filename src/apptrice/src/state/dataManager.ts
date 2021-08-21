import { DbBot, DBBotDeploymentWithHistory, DbBotVersion, DbExchangeAccount, SimpleBotDeployment } from '../../../lambdas/model.types';
import lorese from './Lorese';

export interface StoreAccount {
	id: string,
	bots?: string[],
	deployments?: string[],
	exchangeAccounts?: string[]
}

export interface StoreBotVersion {
	accountId: string
	botId: string
	number: string
	code: string
	isLocked: boolean
	label: string
	createdAt: number
	updatedAt: number
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
		[id:string]: StoreBotVersion
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