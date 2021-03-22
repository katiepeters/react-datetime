
import { RESTv2 } from 'bfx-api-node-rest';
import { Order as BfxOrder } from 'bfx-api-node-models';
import { CandleQuery, ExchangeAdapter, ExchangeCredentials, ExchangeOrder } from '../ExchangeAdapter';

const fetch = require('node-fetch');
const baseUrl = 'https://api-pub.bitfinex.com/v2';

let cache = {};

class BitfinexAdapter implements ExchangeAdapter {
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
			if( wallet[0] === 'EXCHANGE' ){
				portfolio[ wallet[1] ] = {
					asset: wallet[1],
					free: wallet[4],
					locked: wallet[2] - wallet[4]
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

	async placeOrder(order: LimitOrderInput | MarketOrderInput): Promise<Order> {
		let orderOptions: any = {
			type: order.type.toUpperCase(),
			symbol: getSymbol(order.symbol),
			amount: order.direction === 'buy' ? order.amount : order.amount * -1
		}
		if( order.type === 'limit' ){
			orderOptions.price = order.price;
		}

		let bfxOrder = new BfxOrder(orderOptions);
		let placedOrder = await this.bfx.submitOrder( orderOptions );

		return {
			...order,
			foreignId: placedOrder[0]
		};
	}
	cancelOrder(orderId: string): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	getOpenOrders(): Promise<ExchangeOrder[]> {
		throw new Error('Method not implemented.');
	}
	getOrderHistory(): Promise<ExchangeOrder[]> {
		throw new Error('Method not implemented.');
	}
}


function getKey(options: CandleQuery): string {
	return `${options.market}:${options.interval}:${options.lastCandleAt}:${options.candleCount}`;
}


function getSymbol(market) {
	return `t${market.replace('/', '')}`;
}