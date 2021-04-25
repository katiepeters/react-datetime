import { mutationHandler, queryHandler } from "../utils/RequestHandler"
import deleteBotHandler from "./deleteBot";
import getBotListHandler from "./getBotList"
import getSingleBotHandler from "./getSingleBot";
import updateBotHandler from "./updateBot";

const botsAPI = {
	initialize( app:any ){
		app.get('/bots', function(req, res) {
			return queryHandler( req, res, getBotListHandler );
		});

		app.get('/bots/:botId', function( req, res) {
			return queryHandler( req, res, getSingleBotHandler );
		});

		app.patch('/bots/:botId', function( req, res) {
			return mutationHandler( req, res, updateBotHandler );
		});

		app.delete('/bots/:botId', function( req, res ) {
			return mutationHandler( req, res, deleteBotHandler );
		});
	}
}

export default botsAPI;