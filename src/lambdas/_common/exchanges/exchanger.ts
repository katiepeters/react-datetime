import BitfinexAdapter from './adapters/BitfinexAdapter';
import {ExchangeAdapter} from './ExchangeAdapter';

const AES = require("crypto-js/aes");
const utf8Encode = require("crypto-js/enc-utf8");

const adapters = {
	bitfinex: BitfinexAdapter
};

interface ExchangerConfig {
	exchange: string
	accountId: string
	key: string
	secret: string
}

const exchanger = {
	getAdapter(config: ExchangerConfig): ExchangeAdapter | void {
		let Adapter = adapters[config.exchange];
		if( !Adapter ) {
			console.warn(`Cant find an adapter for ${config.exchange}`);
			return;
		}

		console.log('Config secret', AES.decrypt(config.secret, config.accountId).toString(utf8Encode));
		return new Adapter({
			key: config.key,
			secret: AES.decrypt(config.secret, config.accountId).toString(utf8Encode)
		});
	}
}

export default exchanger;