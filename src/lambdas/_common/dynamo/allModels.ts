import AccountModel from './AccountModel';
import BotDeploymentModel from './BotDeploymentModel';
import BotModel from './BotModel';
import ExchangeAccountModel from './ExchangeAccountModel';

const allModels = {
	account: AccountModel,
	bot: BotModel,
	deployment: BotDeploymentModel,
	exchangeAccount: ExchangeAccountModel
}

export default allModels;