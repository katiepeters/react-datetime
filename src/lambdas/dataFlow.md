id -> config, state, data, stats, bot

config -> candles, orders, portfolio

orders, data -> updatedData, updatedStats

orders, updatedData, portfolio -> trader

config, state, trader, candles, bot -> orderUpdates, nextState

orderUpdates, updatedStats -> nextData, nextStats

----------------

account -> bots, botDeployments, exchangeAccounts
bot -> versions, code
botDeployment -> botId, botVersion, config, state, data
backtests -> botId, botVersion, config, data


accountId -> BOT#BOT_ID#VERSION_ID
					-> DEPLOYMENT#DEPLOYMENT_ID
					-> BACKTEST#BOT_ID#ID
					-> ACCOUNT
					-> EXCHANGE#EXCHANGE_ID