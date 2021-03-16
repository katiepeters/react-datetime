const serverless = require('serverless-http');
const express = require('express')
const app = express()

app.get('/', function (req, res) {
	console.log('Hello!');
	res.send('Hello World!')
});

app.get('/accounts/:id', function(req, res){
	res.send('/account/:id not implemented yet');
});

app.get('/bots', function (req, res) {
	res.send('/bots not implemented yet');
});

app.get('/deployments', function (req, res) {
	res.send('/deployments not implemented yet');
});

app.get('/exchanges', function (req, res) {
	res.send('/exchanges not implemented yet');
});

export const apitron = serverless(app);

