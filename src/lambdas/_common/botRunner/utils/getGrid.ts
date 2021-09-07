export default function getGrid(targetPrice: number, gridSize: number, levels=3){
	let levelizedPrice = targetPrice;
	let factor = 1;
	while (levelizedPrice < baseLevels[0]) {
		levelizedPrice *= 10;
		factor *= 10;
	}

	let priceIndex = findPriceLevelIndex(levelizedPrice);
	let aboveIndices:number[] = [];
	let i = levels;
	let index = priceIndex + 1;
	while( i > 0 ){
		if( index % gridSize === 0 ){
			aboveIndices.push(index);
			i--;
		}
		index++;
	}

	let belowIndices: number[] = [];
	i = levels;
	index = priceIndex;
	while( i > 0 ){
		if( index % gridSize === 0 ){
			belowIndices.push(index);
			i--;
		}
		index--;
	}

	return {
		above: aboveIndices.map( index => getLevelByIndex(index, factor, gridSize) ),
		below: belowIndices.map( index => getLevelByIndex(index, factor, gridSize) )
	};
}


// Binary search
function findPriceLevelIndex(price: number) {
	let start = 0;
	let end = baseLevels.length - 1;

	if (baseLevels[end] <= price) {
		return end;
	}

	while (!(baseLevels[start] <= price && baseLevels[start + 1] > price)) {
		let half = Math.round((end + start) / 2);
		if (baseLevels[half] <= price) {
			start = half;
		}
		else {
			end = half;
		}
	}

	return start;
}

// Get the level, handling indices that overflows the baseLevels array
function getLevelByIndex(index: number, initialFactor: number, gridSize: number) {
		let factor = initialFactor;
		let parsedIndex = index;
		let levelsLength = baseLevels.length;

		if (index < 0) {
			factor *= 10;
			parsedIndex += levelsLength;
			parsedIndex -= parsedIndex % gridSize;
		}
		if (index > levelsLength - 1) {
			factor /= 10;
			parsedIndex -= levelsLength;
			parsedIndex -= parsedIndex % gridSize;
		}

		return baseLevels[parsedIndex] / factor;
	}


// Level calculation
const baseLevels = [1000000, 1009889, 1019875, 1029960, 1040145, 1050431, 1060818, 1071309, 1081902, 1092601, 1103405, 1114317, 1125336, 1136464, 1147702, 1159051, 1170513, 1182088, 1193777, 1205582, 1217504, 1229543, 1241702, 1253981, 1266381, 1278904, 1291550, 1304322, 1317220, 1330246, 1343400, 1356685, 1370100, 1383649, 1397331, 1411149, 1425104, 1439196, 1453428, 1467800, 1482315, 1496973, 1511776, 1526726, 1541823, 1557070, 1572467, 1588017, 1603720, 1619579, 1635594, 1651768, 1668102, 1684598, 1701256, 1718079, 1735069, 1752226, 1769554, 1787052, 1804724, 1822570, 1840593, 1858794, 1877175, 1895738, 1914484, 1933416, 1952535, 1971843, 1991342, 2011034, 2030920, 2051004, 2071285, 2091768, 2112453, 2133342, 2154438, 2175743, 2197258, 2218986, 2240929, 2263089, 2285468, 2308068, 2330892, 2353941, 2377219, 2400726, 2424466, 2448441, 2472653, 2497104, 2521797, 2546735, 2571919, 2597352, 2623036, 2648974, 2675169, 2701623, 2728339, 2755319, 2782565, 2810081, 2837869, 2865932, 2894272, 2922893, 2951796, 2980986, 3010464, 3040234, 3070297, 3100659, 3131320, 3162285, 3193556, 3225136, 3257028, 3289236, 3321762, 3354610, 3387783, 3421284, 3455116, 3489282, 3523787, 3558633, 3593823, 3629361, 3665251, 3701495, 3738098, 3775063, 3812394, 3850093, 3888166, 3926615, 3965444, 4004657, 4044258, 4084250, 4124638, 4165425, 4206616, 4248214, 4290223, 4332648, 4375492, 4418760, 4462456, 4506584, 4551148, 4596153, 4641603, 4687502, 4733856, 4780667, 4827942, 4875684, 4923898, 4972589, 5021762, 5071420, 5121570, 5172216, 5223362, 5275014, 5327178, 5379856, 5433056, 5486782, 5541039, 5595833, 5651168, 5707051, 5763486, 5820480, 5878037, 5936163, 5994864, 6054145, 6114013, 6174472, 6235530, 6297191, 6359462, 6422349, 6485858, 6549995, 6614765, 6680177, 6746235, 6812947, 6880318, 6948355, 7017065, 7086455, 7156531, 7227300, 7298768, 7370944, 7443833, 7517442, 7591780, 7666853, 7742668, 7819233, 7896555, 7974642, 8053501, 8133139, 8213566, 8294787, 8376812, 8459648, 8543302, 8627785, 8713102, 8799263, 8886277, 8974150, 9062893, 9152513, 9243020, 9334421, 9426727, 9519945, 9614084, 9709155, 9805166, 9902127];