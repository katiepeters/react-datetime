
import { BotCandles } from "../../../../lambdas/lambda.types";
import { ActiveInterval, ConsoleEntry, DBBotDeploymentState, DeploymentOrders, PortfolioHistoryItem, RunInterval, RunnableDeployment } from "../../../../lambdas/model.types";
import { ScreenProps } from "../../types";

export interface BtDeployment {
	logs: ConsoleEntry[]
	orders: DeploymentOrders
	runInterval: RunInterval
	state: DBBotDeploymentState
	pairs: string[]
	portfolioHistory: PortfolioHistoryItem[],
	activeIntervals: ActiveInterval[]
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
	deployment: RunnableDeployment
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
	deployment?: RunnableDeployment
	exchange?: BtExchange
	logs?: ConsoleEntry[]
	orders?: DeploymentOrders
	runInterval?: RunInterval
	state?: DBBotDeploymentState
	pairs?: string[]
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