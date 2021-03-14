const fs = require('fs').promises;

module.exports = {
	save: async function( botName, content ) {
		await fs.writeFile(getBotPath(botName), content, 'utf-8');
		return true;
	},
	load: async function( botName ) {
		return await fs.readFile(getBotPath(botName), 'utf-8');
	}
}

const DATA_PATH = fs.join(__dirname, '../botStates');
function getBotPath( botName ) {
	return fs.join(DATA_PATH, `${botName}.json`);
}