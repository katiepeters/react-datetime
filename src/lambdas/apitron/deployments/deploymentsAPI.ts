import { mutationHandler, queryHandler } from "../utils/RequestHandler";
import createDeploymentHandler from "./createDeployment";
import deleteDeploymentHandler from "./deleteDeployment";
import getDeploymentListHandler from "./getDeploymentList";
import getSingleDeploymentHandler from "./getSingleDeployment";
import updateDeploymentHandler from "./updateDeployment";

const deploymentAPI = {
	initialize( app: any ){
		app.get('/deployments', function( req, res ) {
			return queryHandler( req, res, getDeploymentListHandler );
		});

		app.get('/deployments/:deploymentId', function( req, res) {
			return queryHandler( req, res, getSingleDeploymentHandler );
		})

		app.patch('/deployments/:deploymentId', function(req, res) {
			return mutationHandler(req, res, updateDeploymentHandler);
		});

		app.post('/deployments', function (req, res) {
			return mutationHandler(req, res, createDeploymentHandler);
		});

		app.delete('/deployments/:deploymentId', function(req, res) {
			return mutationHandler(req, res, deleteDeploymentHandler);
		});

	}
}

export default deploymentAPI;
