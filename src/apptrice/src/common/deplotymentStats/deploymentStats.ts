import {DBBotDeployment, DbExchangeAccount } from "../../../../lambdas/model.types";

export function getDeploymentStats( deployment: DBBotDeployment, exchange: DbExchangeAccount, appraiser: any ){
	console.log( deployment, exchange, appraiser );
}