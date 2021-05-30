import { mutationHandler, queryHandler } from "../utils/RequestHandler";
import getPrices from "./getPrices";


const exchangesAPI = {
	initialize( app: any ){
		app.get('/prices', function(req,res) {
			return queryHandler( req, res, getPrices );
		});
	}
}

export default exchangesAPI;