let adapter;
if( isLocalEnvironment() ){
	adapter = require('./storeAdapters/fileStoreAdapter');
}
else {
	adapter = require('./storeAdapters/s3StoreAdapter');
}

module.exports = {
	save: async function( botName, data ) {
		await adapter.save( botName, JSON.stringify(data) );
	},

	load: async function( botName ) {
		let contents = adapter.load( botName );
		if( !contents ) return {};
		let data = {};
		try {
			data = JSON.parse( contents );
		}
		catch( err ) {
			console.error(`Error parsing the bot state: ${botName}`);
		}
		return data;
	}
}

function isLocalEnvironment() {
	return true;
}