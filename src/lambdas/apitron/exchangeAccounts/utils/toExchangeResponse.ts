import { DbExchangeAccount } from "../../../model.types";
import { ExchangeAccountResponse } from "../../apitron.types";

export default function toExchangeResponse( exchange: DbExchangeAccount ): ExchangeAccountResponse{
	return {
		id: exchange.id,
		accountId: exchange.accountId,
		provider: exchange.provider,
		type: exchange.type,
		key: exchange.key.slice(0, 5) + '...',
		portfolio: exchange.type === 'virtual' ? exchange.key : null
	}
}