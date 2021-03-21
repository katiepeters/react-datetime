const AWS = require('aws-sdk');
AWS.config.update({
	endpoint: "http://localhost:8000"
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

type TableAtrributeValue = string | string[]

export interface TableItem {
	accountId: string
	resourceId: string
	[attribute:string]: any
}

export class DBModel<T> {
	async put(item: T ): Promise<void> {
		await dynamoDb.put({
			TableName: process.env.ACCOUNTS_TABLE,
			Item: item
		}).promise();
	}

	async getSingle( accountId: string, resourceId: string ): Promise<T|void> {
		const payload = {
			TableName: process.env.ACCOUNTS_TABLE,
			Key: { accountId, resourceId }
		};
		console.log( payload );
		let res = await dynamoDb.get(payload).promise();
		return res.Item;
	}

	async getMultiple(accountId: string, resourcePrefix: string): Promise<T[]> {
		let res = await dynamoDb.query({
			TableName: process.env.ACCOUNTS_TABLE,
			KeyConditionExpression: 'accountId = :a and begins_with(resourceId, :r)',
			ExpressionAttributeValues: {
				':a': accountId,
				':r': resourcePrefix
			}
		}).promise();
		return res.Items;
	}

	async update(accountId: string, resourceId: string, update: { [attribute: string]: TableAtrributeValue} ): Promise<void>{
		let AttributeUpdates = {};
		for( let key in update ){
			AttributeUpdates[key] = {Action: 'PUT', Value: update[key]};
		}
		await dynamoDb.update({
			TableName: process.env.ACCOUNTS_TABLE,
			Key: {accountId, resourceId},
			AttributeUpdates
		}).promise();
	}

	async del( accountId: string, resourceId:string ): Promise<void> {
		await dynamoDb.delete({
			TableName: process.env.ACCOUNTS_TABLE,
			Key: { accountId, resourceId }
		}).promise();
	}
}