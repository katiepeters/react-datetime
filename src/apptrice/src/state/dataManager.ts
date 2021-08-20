import { DbBot, DBBotDeployment, DBBotDeploymentWithHistory, DbBotVersion, DbExchangeAccount } from '../../../lambdas/model.types';
import lorese from './Lorese';

interface Account {
	id: string,
	bots?: string[],
	deployments?: string[],
	exchangeAccounts?: string[]
}

interface Store {
	authenticatedId: string
	accounts: {
		[id: string]: Account
	},
	deployments: {
		[id: string]: Partial<DBBotDeploymentWithHistory>
	},
	bots: {
		[id:string]: Partial<DbBot>
	},
	exchangeAccounts: {
		[id:string]: Partial<DbExchangeAccount>
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