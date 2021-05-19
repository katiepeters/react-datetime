import { DbExchangeAccount } from '../../model.types';
import BitfinexAdapter from './adapters/BitfinexAdapter';
import VirtualAdapter from './adapters/VirtualAdapter';
import {ExchangeAdapter} from './ExchangeAdapter';

const AES = require("crypto-js/aes");
const utf8Encode = require("crypto-js/enc-utf8");

const adapters = {
	bitfinex: BitfinexAdapter,
	virtual: VirtualAdapter
};

const exchanger = {
	getAdapter(exchangeAccount: DbExchangeAccount): ExchangeAdapter | void {
		let Adapter = exchangeAccount.type === 'virtual' ?
			adapters.virtual :
			adapters[exchangeAccount.provider]
		;
		
		if( !Adapter ) {
			console.warn(`Cant find an adapter for ${exchangeAccount.exchange}`);
			return;
		}

		if( exchangeAccount.type === 'real' ){
			exchangeAccount = {
				...exchangeAccount,
				secret: AES.decrypt(exchangeAccount.secret, exchangeAccount.accountId).toString(utf8Encode)
			}
		}

		return new Adapter( exchangeAccount );
	}
}

export default exchanger;