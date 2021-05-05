import { mutationHandler, queryHandler } from "../utils/RequestHandler";
import createExchangeAccountHandler from "./createExchangeAccount";
import deleteExchangeAccountHandler from "./deleteExchangeAccount";
import getExchangeAccountListHandler from "./getExchangeAccountList";
import getSingleExchangeAccountHandler from "./getSingleExchangeAccount";

const exchangesAPI = {
	initialize( app: any ){
		app.post('/exchanges', function(req,res) {
			return mutationHandler( req, res, createExchangeAccountHandler );
		});

		app.get('/exchanges', function( req,res) {
			return queryHandler( req, res, getExchangeAccountListHandler );
		});

		app.get('/exchanges/:exchangeAccountId', function(req,res) {
			return queryHandler( req, res, getSingleExchangeAccountHandler );
		});

		app.delete('/exchanges/:exchangeAccountId', function(req,res) {
			return  mutationHandler( req, res, deleteExchangeAccountHandler );
		});
	}
}

export default exchangesAPI;