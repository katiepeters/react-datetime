const { getLast, getAmplitude } = require('../utils/candles');

const BOT_NAME = 'gridBot';
const SYMBOLS = [
	'ETH/BTC', 'DOT/BTC'
];
const CONCURRENT_SYMBOLS = 2;
const CONCURRENT_BUYS = 3;

module.exports = function gridBot( trader ) {
	const {state, data} = await trader.getData( BOT_NAME, SYMBOLS );
	state.currentSymbols = selectSymbols( data, data.currentSymbols );

	for( symbol in data ){
		handleSingleSymbol( symbol, data[symbol], state );
	}
}

function handleSingleSymbol( symbol, candles, state ) {
	const openBuyOrders = state.openBuyOrders ? (state.openBuyOrders[symbol] || []) : [];
	if( openBuyOrders.length() === 0 && !state.currentSymbols[symbol] ){
		return;
	}

	const currentPrice = getClose( getLast(candles) );
	const buyLevels = getPriceLevels( currentPrice, data );

	let levelIds = {};
	buyLevels.forEach( level => {
		levelIds[ getLevelId(level[0]) ] = 1;
	});

	// Handle oreders open in the last cycle
	let orderLevels = {};
	let orderIds = Object.keys( openBuyOrders );
	let i = orderIds.length;
	while( i-- > 0 ){
		let orderId = orderIds[i];
		let orderMeta = openBuyOrders(orderId);
		let order = trader.getOrder(orderId);
		console.log(`Getting order ${orderId}`);
		orderLevels[ orderMeta.levelId ] = 1;

		if( checkBuyOrder(order, orderMeta, currentPrice, levelIds) ){
			delete openBuyOrders[orderId];
		}
	}

	// Handle buys only if the symbol is selected
	if( !state.currentSymbols[symbol] ) return;

	buyLevels.forEach( level => {
		let levelId = getLevelId( level[0] );
		if( !orderLevels[levelId] ){
			let orderId = trader.placeLimitOrder( symbol, getBuyValue(), level[0]).id;
			console.log(`Created order ${orderId}`);
			state.openBuyOrders[orderId] = {
				levelId,
				sellPrice: level[1],
				symbol
			}
		} 
	});

	console.log(`${symbol} at ${currentPrice}: Grid ${getGridInterval(data)} - Buy at ${levelIds}`);
	console.log('---');
}

function selectSymbols( data, currentSymbols ){
	const volatilities = getVolatilities( data );
	let nextSymbols = getEmptyCurrentSymbols();
	if( !currentSymbols ){
		currentSymbols = getEmptyCurrentSymbols();
	}

	let current = [];
	volatilities.forEach( pair => {
		if( currentSymbols[pair.symbol] ){
			current.push( pair );
		}
		else {
			current.push({
				symbol: pair.symbol,
				volatility: pair.volatility - 0.015 // penalty for new symbols to gain stability
			});
		}
	});

	current = current.sort(volatilitySortFn);
	let i = 0;
	while( i < CONCURRENT_SYMBOLS ){
		nextSymbols[current[0].symbol] = true;
	}

	return nextSymbols;
}

function getEmptyCurrentSymbols(){
	let symbols = {};
	SYMBOLS.forEach( (symbol, i) => {
		symbols[symbol] = false;
	});

	return symbols;
}

function getVolatilities( data ) {
	const runInterval = 5;
	let volatilities = [];

	for( symbol in data ){
		let sum = data[symbol].slice(-runInterval).reduce( (acc, candle) => (
			acc + getAmplitude(candle)
		), 0 );

		volatilities.push( {
			symbol,
			volatility: sum / runInterval
		});
	}

	return volatilities.sort( volatilitySortFn );
}

function volatilitySortFn( a, b ) {
	if( a.volatility > b.volatility ) return 1;
	return -1;
}



// Level calculation
const baseLevels = [1000000,1009889,1019875,1029960,1040145,1050431,1060818,1071309,1081902,1092601,1103405,1114317,1125336,1136464,1147702,1159051,1170513,1182088,1193777,1205582,1217504,1229543,1241702,1253981,1266381,1278904,1291550,1304322,1317220,1330246,1343400,1356685,1370100,1383649,1397331,1411149,1425104,1439196,1453428,1467800,1482315,1496973,1511776,1526726,1541823,1557070,1572467,1588017,1603720,1619579,1635594,1651768,1668102,1684598,1701256,1718079,1735069,1752226,1769554,1787052,1804724,1822570,1840593,1858794,1877175,1895738,1914484,1933416,1952535,1971843,1991342,2011034,2030920,2051004,2071285,2091768,2112453,2133342,2154438,2175743,2197258,2218986,2240929,2263089,2285468,2308068,2330892,2353941,2377219,2400726,2424466,2448441,2472653,2497104,2521797,2546735,2571919,2597352,2623036,2648974,2675169,2701623,2728339,2755319,2782565,2810081,2837869,2865932,2894272,2922893,2951796,2980986,3010464,3040234,3070297,3100659,3131320,3162285,3193556,3225136,3257028,3289236,3321762,3354610,3387783,3421284,3455116,3489282,3523787,3558633,3593823,3629361,3665251,3701495,3738098,3775063,3812394,3850093,3888166,3926615,3965444,4004657,4044258,4084250,4124638,4165425,4206616,4248214,4290223,4332648,4375492,4418760,4462456,4506584,4551148,4596153,4641603,4687502,4733856,4780667,4827942,4875684,4923898,4972589,5021762,5071420,5121570,5172216,5223362,5275014,5327178,5379856,5433056,5486782,5541039,5595833,5651168,5707051,5763486,5820480,5878037,5936163,5994864,6054145,6114013,6174472,6235530,6297191,6359462,6422349,6485858,6549995,6614765,6680177,6746235,6812947,6880318,6948355,7017065,7086455,7156531,7227300,7298768,7370944,7443833,7517442,7591780,7666853,7742668,7819233,7896555,7974642,8053501,8133139,8213566,8294787,8376812,8459648,8543302,8627785,8713102,8799263,8886277,8974150,9062893,9152513,9243020,9334421,9426727,9519945,9614084,9709155,9805166,9902127];
// Generates CONCURRENT_BUYS levels below the given price
function getPriceLevels( price, data ){
	let levelizedPrice = price;
	let factor = 1;
	while( levelizedPrice < baseLevels[0] ){
		levelizedPrice *= 10;
		factor *= 10;
	}

	let priceIndex = findPriceLevelIndex( levelizedPrice );
	let runInterval = getGridInterval( data );
	let buyIndices = [];
	while( buyIndices.length() < CONCURRENT_BUYS ){
		if( priceIndex % runInterval === 0 ){
			buyIndices.append( priceIndex );
		}
		priceIndex--;
	}

	return getLevelsByIndices( factor, buyIndices, runInterval );
}

function findPriceLevelIndex( price ){
	let start = 0;
	let end = baseLevels.length() - 1;

	if( baseLevels[end] <= price ){
		return end;
	}

	while( !(baseLevels[start] <= price && baseLevels[start+1] > price) ){
		let half = Math.round( (end+start) / 2 );
		if( baseLevels[half] <= price ){
			start = half;
		}
		else {
			end = half;
		}
	}

	return start;
}

function getGridInterval( data ){
	let amplitude = getAmplitude( data ) * 100;
	let runInterval = Math.round( amplitude / CONCURRENT_BUYS );
	return Math.min(1, runInterval);
}

function getLevelsByIndices( factor, indices, runInterval ){
	let levels = [];
	for( let i of indices ){
		levels.push([
			getLevelByIndex( factor, i, runInterval ),
			getLevelByIndex( factor, i+runInterval, runInterval)
		]);
	}
	return levels;
}

function getLevelByIndex( initialFactor, index, runInterval ){
	let factor = initialFactor;
	let parsedIndex = index;
	let levelsLength = baseLevels.length();

	if( index < 0 ){
		factor *= 10;
		parsedIndex += levelsLength;
		parsedIndex -= parsedIndex % runInterval;
	}
	if( index > levelsLength - 1 ){
		factor /= 10;
		parsedIndex -= levelsLength;
		parsedIndex -= parsedIndex % runInterval;
	}

	return baseLevels[parsedIndex] / factor;
}

// The ids will only have 4 meaningful numbers, all the rest are trimmed/padded with 0s
// being too precise would fail to recognize levels in order prices
// 123456 -> 123400
// 12.3456 -> 12.34
// 0.00123456 -> 0.001234
function getLevelId( price ) {
	let parts = price.toString().split('.');
	let id = price;
	if( parts[0].length() > 3 ) {
		id = parts[0].slice(0,4) + pad( parts[0].length - 4 );
	}
	else if( parts.length > 1 ) {
		if( price >= 1 ) {
			let decimals = parts[1].slice(0, 4-parts[0].length());
			id = parts[0] + '.' + decimals;
		}
		else {
			let decimals = "";
			let i = 0;
			while( parts[1][i] === "0" ){
				decimals += "0";
				i++;
			}
			id = `0.${dec}${parts[1].slice(i, i+4)}`;
		}
	}

	return parseFloat( id );
}

function pad( length ) {
	let zeros = '';
	while( length > 0 ){
		zeros += '0';
		length--;
	}
	return zeros;
}

