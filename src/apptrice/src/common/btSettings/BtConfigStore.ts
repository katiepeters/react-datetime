import { RunInterval } from "../../../../lambdas/model.types";

const LS_KEY = "BT_CONFIGS";

interface BacktestConfigs {
	[botId: string]: BtSettingsConfig
}

export interface BtSettingsConfig {
	baseAssets: string
	quotedAsset: string
	runInterval: RunInterval
	initialBalances: { [asset: string]: string },
	testingTimeframe: string
	startDate?: string
	endDate?: string
	fees: string
	slippage: string
}

function getConfigs(): BacktestConfigs {
	let configs:any = localStorage.getItem(LS_KEY);
	if( configs ){
		try {
			configs = JSON.parse( configs );
		}
		catch (error) {
			console.error('Cant parse bot configs');
			configs = {};
		}
	}
	else {
		configs = {};
	}
	return configs;
}

function getBtConfig(botId: string): BtSettingsConfig | void {
	return getConfigs()[botId];
}

function saveBtConfig(botId: string, config: BtSettingsConfig) {
	let configs = getConfigs();
	configs[botId] = config;
	localStorage.setItem(LS_KEY, JSON.stringify(configs) );
}

export {getBtConfig, saveBtConfig};