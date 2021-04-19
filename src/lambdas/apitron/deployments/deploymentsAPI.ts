const deploymentAPI = {
	initialize( app: any, models: any ){
		app.get('/deployments', function( req, res ) {
			return getDeploymentList( req, res, models );
		});

		app.post('/deployments', function( req, res) {
			return createDeployment( req, res, models );
		})


	}
}

export default deploymentAPI;


function getDeploymentList(req, res, models) {
	res.send('/deployments not implemented yet');
}

function createDeployment(req, res, models ){
	res.send('deployment creation not implemented')
}