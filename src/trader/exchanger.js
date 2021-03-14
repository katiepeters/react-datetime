let exchange;
module.exports = {
	setExchange( exchangeName ) {
		if( exchangeName === 'bitfinex' ){
			exchange = require('./exchanges/bitfinex');
		}
	},

	async getPortfolio(){
		return await exchange.getPortfolio();
	},

	async getCandles( symbol, timeframe, limit ) {
		return await getCandles( symbol, timeframe, limit );
	},

	async placeLimitOrder( symbol, price, value ) {
		return await placeLimitOrder( symbol, price, value );
	},

	async placeMarketOrder( symbol, value ) {
		return await placeMarketOrder( symbol, value );
	},

	async cancelOrder( orderId ) {
		return await cancelOrder( orderId );
	},

	async getOpenOrders() {
		return await this.getOpenOrders();
	},

	async getOrderHistory() {
		return await this.getOrderHistory();
	}
}