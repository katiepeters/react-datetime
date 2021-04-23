import { mutationHandler, queryHandler } from "../utils/RequestHandler";
import createDeploymentHandler from "./createDeployment";
import getDeploymentListHandler from "./getDeploymentList";

const deploymentAPI = {
	initialize( app: any, models: any ){
		app.get('/deployments', async function( req, res ) {
			return await queryHandler( req, res, getDeploymentListHandler );
		});

		app.post('/deployments', async function (req, res) {
			return await mutationHandler(req, res, createDeploymentHandler);
		});
	}
}

export default deploymentAPI;
