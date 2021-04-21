import AccountModel from './AccountModel';
import BotDeploymentModel from './BotDeploymentModel';
import BotModel from './BotModel';
import ExchangeAccountModel from './ExchangeAccountModel';

export interface DynamoModels {
	account: typeof AccountModel
	bot: typeof BotModel,
	deployment: typeof BotDeploymentModel,
	exchangeAccount: typeof ExchangeAccountModel
}

const allModels: DynamoModels = {
	account: AccountModel,
	bot: BotModel,
	deployment: BotDeploymentModel,
	exchangeAccount: ExchangeAccountModel
}

export default allModels;