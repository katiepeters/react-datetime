import { ArrayCandle, BotCandles } from "../../../lambdas/lambda.types";
import { ConsoleEntry, DBBotDeploymentState, DeploymentOrders, PortfolioHistoryItem, RunInterval } from "../../../lambdas/model.types";

export interface BtDeployment {
	logs: ConsoleEntry[]
	orders: DeploymentOrders
	runInterval: RunInterval
	state: DBBotDeploymentState
	symbols: string[]
}

export interface BtExchange {
	portfolioHistory: PortfolioHistoryItem[],
	fees: number
	slippage: number
}

export interface BtStored {
	accountId: string
	botId: string
	provider: 'bitfinex'
	startDate: number
	endDate: number
	deployment: BtDeployment
	exchange: BtExchange
}

type BtStatus = 'init' | 'candles' | 'running' | 'completed' | 'aborted' | 'error';

export interface BtActive {
	totalIterations: number
	currentIteration: number
	candles: BotCandles
	status: BtStatus
	data: BtStored
}

export interface ActiveBtUpdate {
	accountId?: string
	botId?: string
	provider?: 'bitfinex'
	startDate?: number
	endDate?: number
	deployment?: BtDeployment
	exchange?: BtExchange
	logs?: ConsoleEntry[]
	orders?: DeploymentOrders
	runInterval?: RunInterval
	state?: DBBotDeploymentState
	symbols?: string[]
	portfolioHistory?: PortfolioHistoryItem[],
	fees?: number
	slippage?: number
	totalIterations?: number
	currentIteration?: number
	candles?: BotCandles
	status?: BtStatus
}
