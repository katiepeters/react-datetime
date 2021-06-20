import { mutationHandler, queryHandler } from "../utils/RequestHandler";
import createBotVersionHandler from "./createBotVersion";
import getSingleBotVersionHandler from "./getSingleBotVersion";
import updateBotVersionHandler from "./updateBotVersion";

const botVersionsAPI = {
	initialize( app: any ){
		app.get('/botVersions/:number', function(req, res) {
			return queryHandler( req, res, getSingleBotVersionHandler );
		});

		app.post('/botVersions', function(req,res) {
			return mutationHandler( req, res, createBotVersionHandler );
		});

		app.patch('/botVersions/:number', function(req, res){
			return mutationHandler( req, res, updateBotVersionHandler );
		})
	}
}

export default botVersionsAPI;