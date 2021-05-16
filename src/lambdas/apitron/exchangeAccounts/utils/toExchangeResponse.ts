import { DbExchangeAccount, ExchangeAccountResponse } from "../../../model.types";

export default function toExchangeResponse( exchange: DbExchangeAccount ): ExchangeAccountResponse {
	return {
		id: exchange.id,
		accountId: exchange.accountId,
		name: exchange.name,
		provider: exchange.provider,
		type: exchange.type,
		key: exchange.key ? exchange.key.slice(0, 5) + '...' : ''
	}
}