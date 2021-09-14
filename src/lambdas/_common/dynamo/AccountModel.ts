import { DynamoAccount, DBAccountInput, ModelAccount } from '../../model.types';
import {DBModel} from './db';

const Db = new DBModel<DynamoAccount>();

export default {
	async getSingle(id:string): Promise<ModelAccount | void> {
		const account = await Db.getSingle(id, 'ACCOUNT');
		if( account ){
			return dynamoToModel(account);
		}
	},
	async create(account: DBAccountInput): Promise<void> {
		return await Db.put( modelToDynamo({
			id: account.id,
			createdAt: Date.now()
		}));
	}
}

function dynamoToModel( dynamoAccount: DynamoAccount ): ModelAccount {
	const {resourceId, accountId, ...baseAccount} = dynamoAccount;
	return {
		id: accountId,
		...baseAccount
	}
}

function modelToDynamo( modelAccount: ModelAccount ): DynamoAccount {
	const {id, ...baseBot} = modelAccount;
	return {
		accountId: id,
		resourceId: `ACCOUNT`,
		...baseBot
	}
}