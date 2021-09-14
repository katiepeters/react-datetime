import { CreateBotDeploymentModelInput, DynamoBotDeployment, FullBotDeployment, ModelBotDeployment, UpdateBotDeploymentModelInput } from '../../model.types';
import { parseId } from '../utils/resourceId';
import s3Helper from '../utils/s3';
import { DBModel } from './db';

const Db = new DBModel<DynamoBotDeployment>();

const emptyOrders = {
	foreignIdIndex: {},
	items: {},
	openOrderIds: []
};
const emptyPlotterData = {
	indicators: [],
	candlestickPatters: [],
	series: {},
	points: {}
}

interface UpdateDeploymentInput {
	id: string
	update: UpdateBotDeploymentModelInput
}

export default {
	async getAccountDeployments( accountId: string ): Promise<ModelBotDeployment[]> {
		let deployments = await Db.getMultiple(accountId, DEPLOYMENT_PREFIX);
		return deployments.map( dynamoToModel );
	},

	async getSingleModel(compoundId: string): Promise<ModelBotDeployment | void > {
		let {accountId, resourceId} = parseId(compoundId);
		let entry = await Db.getSingle(accountId, `${DEPLOYMENT_PREFIX}${resourceId}`);
		if( entry ){
			return dynamoToModel(entry)
		}
	},

	async getSingleFull(compoundId: string): Promise<FullBotDeployment | void > {
		let {accountId, resourceId: deploymentId} = parseId(compoundId);
		let entry = await Db.getSingle(accountId, `${DEPLOYMENT_PREFIX}${deploymentId}`);
		if( !entry ) return;

		let [ logs, state, orders, history, plotterData ] = await Promise.all([
			getLogs(accountId, deploymentId),
			getState(accountId, deploymentId),
			getOrders(accountId, deploymentId),
			getPortfolioHistory(accountId, deploymentId),
			getPlotterData(accountId, deploymentId)
		]);

		return {
			...dynamoToModel(entry),
			state: JSON.parse( state || '{}'),
			orders: orders ? JSON.parse(orders) : emptyOrders,
			logs: JSON.parse(logs || '[]'),
			portfolioHistory: JSON.parse(history || '[]'),
			plotterData: plotterData ? JSON.parse(plotterData) : emptyPlotterData
		}
	},

	async getActiveDeployments( runInterval: string ) {
		return await Db.getIndex('ActiveDeployments').getMultiple({
			pk: {name: 'runInterval', value: runInterval},
			sk: {name: 'active', value: 'true'}
		});
	},

	async create( input: CreateBotDeploymentModelInput ){
		const {id: deploymentId, accountId } = input;
		let dbDeployment: DynamoBotDeployment = {
			name: input.name,
			accountId,
			botId: input.botId,
			version: input.version,
			resourceId: `DEPLOYMENT#${input.id}`,
			exchangeAccountId: input.exchangeAccountId,
			runInterval: input.runInterval,
			pairs: input.pairs,
			createdAt: Date.now(),
			activeIntervals: input.activeIntervals || [],
			stats: input.stats
		};

		if( input.active ){
			dbDeployment.active = 'true';
			dbDeployment.activeIntervals = input.activeIntervals || [[dbDeployment.createdAt]];
		}

		return await Promise.all([
			Db.put(dbDeployment),
			saveLogs(accountId, deploymentId, JSON.stringify(input.logs || [])),
			saveState(accountId, deploymentId, JSON.stringify(input.state || [])),
			saveOrders(accountId, deploymentId, JSON.stringify(input.orders || emptyOrders)),
			savePortfolioHistory(accountId, deploymentId, JSON.stringify(input.portfolioHistory || [])),
			savePlotterData(accountId, deploymentId, JSON.stringify(input.plotterData || emptyPlotterData))
		]);
	},

	// This is useful to activate/deactivate 
	async replace(input: ModelBotDeployment ){
		return await Db.put(modelToDynamo(input));
	},

	async update({ id, update }: UpdateDeploymentInput ){
		let promises: any = [];
		let {accountId, resourceId: deploymentId} = parseId(id);

		if( needsToUpdateDynamo(update) ) {
			promises.push(
				Db.update(accountId, `${DEPLOYMENT_PREFIX}${deploymentId}`, getDynamoUpdate(update))
			);
		}

		if( update.logs ){
			promises.push( saveLogs(accountId, deploymentId, JSON.stringify(update.logs)) );
		}
		if (update.orders) {
			promises.push( saveOrders(accountId, deploymentId, JSON.stringify(update.orders)) );
		}
		if (update.state) {
			promises.push( saveState(accountId, deploymentId, JSON.stringify(update.state)) );
		}
		if( update.portfolioHistory ){
			promises.push(
				savePortfolioHistory(accountId, deploymentId, JSON.stringify(update.portfolioHistory))
			);
		}
		let response;
		try {
			response = await Promise.all( promises );
		}
		catch (err:any) {
			console.log('Weve catched the ERROR');
			console.error( err );
		}
	},

	async delete(id: string) {
		console.log('Id when deleting', id);
		let {accountId, resourceId: deploymentId} = parseId(id);

		let promises = [
			Db.del(accountId, `DEPLOYMENT#${deploymentId}`),
			delLogs(accountId, deploymentId),
			delOrders(accountId, deploymentId),
			delState(accountId, deploymentId),
			delPortfolioHistory(accountId, deploymentId)
		]
		// @ts-ignore
		return await Promise.all(promises);
	}
}

function getLogsFileName( accountId: string, deploymentId: string ){
	return `${accountId}/de-${deploymentId}/logs`;
}
function getStateFileName(accountId: string, deploymentId: string) {
	return `${accountId}/de-${deploymentId}/state`;
}
function getOrdersFileName(accountId: string, deploymentId: string) {
	return `${accountId}/de-${deploymentId}/orders`;
}
function getPortfolioHistoryFileName(accountId: string, deploymentId: string) {
	return `${accountId}/de-${deploymentId}/portfolioHistory`;
}
function getPlotterDataFileName(accountId: string, deploymentId: string){
	return `${accountId}/de-${deploymentId}/plotterData`;
}

function getLogs( accountId: string, deploymentId: string ){
	return s3Helper.botState.getContent( getLogsFileName(accountId, deploymentId) );
}
function getState(accountId: string, deploymentId: string) {
	return s3Helper.botState.getContent(getStateFileName(accountId, deploymentId));
} 
function getOrders(accountId: string, deploymentId: string) {
	return s3Helper.botState.getContent(getOrdersFileName(accountId, deploymentId));
}
function getPortfolioHistory(accountId: string, deploymentId: string) {
	return s3Helper.botState.getContent(getPortfolioHistoryFileName(accountId, deploymentId));
}
function getPlotterData(accountId: string, deploymentId: string) {
	return s3Helper.botState.getContent(getPlotterDataFileName(accountId, deploymentId));
}

function saveLogs(accountId: string, deploymentId: string, logs: string) {
	return s3Helper.botState.setContent(getLogsFileName(accountId, deploymentId), logs);
}
function saveState(accountId: string, deploymentId: string, state: string) {
	return s3Helper.botState.setContent(getStateFileName(accountId, deploymentId), state);
}
function saveOrders(accountId: string, deploymentId: string, orders: string) {
	return s3Helper.botState.setContent(getOrdersFileName(accountId, deploymentId), orders);
}
function savePortfolioHistory(accountId: string, deploymentId: string, portfolioHistory: string) {
	return s3Helper.botState.setContent(getPortfolioHistoryFileName(accountId, deploymentId), portfolioHistory);
}
function savePlotterData(accountId: string, deploymentId: string, portfolioHistory: string) {
	return s3Helper.botState.setContent(getPlotterDataFileName(accountId, deploymentId), portfolioHistory);
}


function delLogs(accountId: string, deploymentId: string) {
	return s3Helper.botState.delObject(getLogsFileName(accountId, deploymentId));
}
function delState(accountId: string, deploymentId: string) {
	return s3Helper.botState.delObject(getStateFileName(accountId, deploymentId));
}
function delOrders(accountId: string, deploymentId: string) {
	return s3Helper.botState.delObject(getOrdersFileName(accountId, deploymentId));
}
function delPortfolioHistory(accountId: string, deploymentId: string) {
	return s3Helper.botState.delObject(getPortfolioHistoryFileName(accountId, deploymentId));
}
function delPlotterData(accountId: string, deploymentId: string) {
	return s3Helper.botState.delObject(getPlotterDataFileName(accountId, deploymentId));
}

const DEPLOYMENT_PREFIX = 'DEPLOYMENT#';
function dynamoToModel( dynamoDevelopment: DynamoBotDeployment ): ModelBotDeployment{
	const {resourceId, accountId, ...attrs} = dynamoDevelopment
	return {
		id: `${resourceId.replace(DEPLOYMENT_PREFIX, '')}${accountId}`,
		accountId,
		...attrs,
		active: attrs.active !== undefined
	};
}

function modelToDynamo( modelDevelopment: ModelBotDeployment): DynamoBotDeployment {
	const {
		id,
		active,
		botId, 
		version, 
		exchangeAccountId, 
		createdAt,
		lastRunAt,
		name,
		runInterval,
		pairs,
		activeIntervals,
		stats
	} = modelDevelopment;
	
	let {resourceId, accountId} = parseId(id);
	return {
		accountId,
		resourceId: `${DEPLOYMENT_PREFIX}${resourceId}`,
		botId, 
		version, 
		exchangeAccountId, 
		createdAt,
		lastRunAt,
		name,
		runInterval,
		pairs,
		activeIntervals,
		stats,
		active: active ? 'true' : undefined
	};
}



const dynamoAttributes = ['version', 'runInterval', 'pairs', 'stats', 'lastRunAt'];
function needsToUpdateDynamo( update: UpdateBotDeploymentModelInput ){
	let i = dynamoAttributes.length;
	while( i-- > 0 ){
		if( update[dynamoAttributes[i]] ){
			return true;
		}
	}
}

function getDynamoUpdate( update: UpdateBotDeploymentModelInput ){
	let filtered = {};
	dynamoAttributes.forEach( (attr: string) => {
		if( update[attr] ){
			filtered[ attr ] = update[attr];
		}
	});
	return filtered;
}