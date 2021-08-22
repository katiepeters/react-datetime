
import { BotCandles } from "../../../../lambdas/lambda.types";
import { ConsoleEntry, DBBotDeploymentState, DeploymentOrders, PortfolioHistoryItem, RunInterval } from "../../../../lambdas/model.types";
import { ScreenProps } from "../../types";

export interface BtDeployment {
	logs: ConsoleEntry[]
	orders: DeploymentOrders
	runInterval: RunInterval
	state: DBBotDeploymentState
	symbols: string[]
	portfolioHistory: PortfolioHistoryItem[]
}

export interface BtExchange {
	provider: 'bitfinex'
	fees: number
	slippage: number
}

export interface BtStored {
	id: string
	accountId: string
	botId: string
	versionNumber: string
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


export interface BtSectionProps extends ScreenProps {
	bt: BtActive
}