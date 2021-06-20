import AccountModel from './AccountModel';
import BotDeploymentModel from './BotDeploymentModel';
import BotModel from './BotModel';
import BotVersionModel from './BotVersionModel';
import ExchangeAccountModel from './ExchangeAccountModel';

export interface DynamoModels {
	account: typeof AccountModel
	bot: typeof BotModel,
	botVersion: typeof BotVersionModel,
	deployment: typeof BotDeploymentModel,
	exchangeAccount: typeof ExchangeAccountModel
}

const allModels: DynamoModels = {
	account: AccountModel,
	bot: BotModel,
	botVersion: BotVersionModel,
	deployment: BotDeploymentModel,
	exchangeAccount: ExchangeAccountModel
}

export default allModels;