module.exports = {
	getData: async function( botName, exchangeName, symbols ){
		let botId = `${botName}_${exchangeName}`;
		let state = await getBotState(botName);
		let data = await getSymbolsData( symbols );
	}
}


async function getBotState( botName ) {

}

async function getSymbolsData( symbols ){
	let data = {}
	symbols.forEach( symbol => {
		data[symbol] = []
	})

	return data;
}