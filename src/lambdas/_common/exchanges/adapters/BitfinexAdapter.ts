
import { RESTv2 } from 'bfx-api-node-rest';
import { Order as BfxOrder } from 'bfx-api-node-models';
import { CandleQuery, ExchangeAdapter, ExchangeCredentials, ExchangeOrder } from '../ExchangeAdapter';
import { ArrayCandle, LimitOrderInput, MarketOrderInput, Order, Portfolio } from '../../../lambda.types';

const fetch = require('node-fetch');
const baseUrl = 'https://api-pub.bitfinex.com/v2';

let cache = {};

export default class BitfinexAdapter implements ExchangeAdapter {
	bfx: RESTv2
	constructor( credentials: ExchangeCredentials ){
		this.bfx = new RESTv2({
			apiKey: credentials.key,
			apiSecret: credentials.secret
		});
	}

	async getPortfolio(): Promise<Portfolio> {
		let wallets = await this.bfx.wallets();
		let portfolio: Portfolio = {};
		wallets.forEach( wallet => {
			if (wallet[0] === 'exchange' ){
				portfolio[ wallet[1] ] = {
					asset: wallet[1],
					free: wallet[4],
					total: wallet[2]
				};
			}
		});
		return portfolio;
	}

	async getCandles(options: CandleQuery): Promise<ArrayCandle[]> {
		const queryKey = getKey(options);
		let candles = cache[queryKey];
		if (candles) {
			return candles;
		}
		const exchangeSegment = getSymbol(options.market);
		const pathParams = `candles/trade:${options.interval}:${exchangeSegment}/hist`;
		const queryParams = `limit=${options.candleCount}&end=${options.lastCandleAt}`;

		console.log(`Request ${baseUrl}/${pathParams}?${queryParams}`);
		const req = await fetch(`${baseUrl}/${pathParams}?${queryParams}`);
		const reversedCandles = await req.json();

		candles = reversedCandles.reverse();
		cache[queryKey] = candles;

		return candles;
	}

	async placeOrders(orders: (LimitOrderInput | MarketOrderInput)[]): Promise<ExchangeOrder[]> {
		let toSubmit = orders.map( order => {
			let bfxOptions: any = {
				type: getBfxOrderType(order.type),
				symbol: getSymbol(order.symbol),
				amount: order.direction === 'buy' ? order.amount : -order.amount
			};

			if (order.type === 'limit') {
				bfxOptions.price = order.price;
			}

			return new BfxOrder(bfxOptions);
		});

		let results = await this.bfx.submitOrderMulti( toSubmit );
		// console.log( 'Orders placed', results.notifyInfo );	
		let placed = results.notifyInfo.map( result => {
			let order = convertToExchangeOrder( result[4] );
			if( result[6] === 'ERROR' ){
				order.status = 'error';
				order.errorReason = result[7];
			}
			return order;
		})
		return placed;
	}
	async cancelOrders(orderIds: string[]): Promise<boolean[]> {
		let results = await this.bfx.cancelOrders(orderIds);
		console.log( 'Orders cancelled', results );
		return results;
	}
	async getOrders(orderIds: string[]): Promise<ExchangeOrder[]> {
		if( !orderIds.length ) return [];

		// Can't Promise.all because nonce errors
		const openOrders = await this.bfx.activeOrdersWithIds(orderIds);
		const closedOrders = await this.bfx.orderHistoryWithIds(orderIds);

		const orders = openOrders.concat( closedOrders );
		console.log( orders );
		return orders;
	}
	async getOpenOrders(): Promise<ExchangeOrder[]> {
		let orders = await this.bfx.activeOrders();
		console.log('RAW ORDERS', orders);
		return orders.map( convertToExchangeOrder );
	}
	async getOrderHistory(): Promise<ExchangeOrder[]> {
		let orders = await this.bfx.orderHistory({}, null, Date.now(), 20);
		console.log('RAW ORDERS', orders);
		return orders.map(convertToExchangeOrder);
	}
}

function getKey(options: CandleQuery): string {
	return `${options.market}:${options.interval}:${options.lastCandleAt}:${options.candleCount}`;
}

function getSymbol(market) {
	return `t${market.replace('/', '')}`;
}

function convertToExchangeOrder(rawOrder): ExchangeOrder {
	let bfxOrder = new BfxOrder(rawOrder);
	let status = getOrderStatus(bfxOrder.status);
	return {
		id: bfxOrder.id,
		symbol: getOrderSymbol(bfxOrder.symbol),
		type: bfxOrder.type.includes('LIMIT') ? 'limit' : 'market',
		status,
		errorReason: null,
		direction: bfxOrder.amount > 0 ? 'buy' : 'sell',
		amount: Math.abs(bfxOrder.amount || bfxOrder.amountOrig),
		price: bfxOrder.price || null,
		executedPrice: bfxOrder.priceAvg || null,
		placedAt: bfxOrder.mtsCreate,
		closedAt: status === 'cancelled' || status === 'completed' ? bfxOrder.mtsUpdate : null
	}
}

function getOrderSymbol( symbol: string ) {
	return symbol.slice(1, symbol.length -3) + '/' + symbol.slice(-3);
}

function getBfxOrderType( type: string ) {
	if( type === 'limit' ){
		return 'EXCHANGE LIMIT';
	}
	return 'EXCHANGE MARKET';
}

function getOrderStatus(status: string): 'pending' | 'placed' | 'completed' | 'cancelled' | 'error' {
	if( !status ) return 'pending';

	let str = status.split(' ')[0];
	switch ( str ){
		case 'ACTIVE':
		case 'PARTIALLY FILLED':
			return 'placed';
		case 'EXECUTED':
			return 'completed';
		case 'CANCELED':
			return 'cancelled';
	}
	return 'pending';
}