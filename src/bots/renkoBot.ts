interface RenkoBlock {
	createdAt: number
	open: number
	close: number
}

const MAX_CONCURRENT_BUYS = 2;
function initializeState( config, state ){
	state.pairData = {}
	config.pairs.forEach( (pair:string) => {
		state.pairData[pair] = {
			lastRenkoBlock: false,
			priceSeed: false,
			isBought: false,
			blockSize: 0.02
		}
	});

	state.initialized = false;
	state.pairSlots = [];
}


function onData(input: BotInput ) {
	let { candleData, state, config, trader, utils } = input;

	if( !state.initialized ){
		const baseAssets = config.pairs.map( pair => utils.getPairAssets(pair).base );
		const {quoted} = utils.getPairAssets(config.pairs[0]);
		checkAlreadyBoughtPairs(quoted, baseAssets, state, trader);
		state.initialized = true;
	}

	config.pairs.forEach( (pair: string) => {
		// console.log(pair, state.pairData, Object.keys(candleData) );
		handlePair( pair, state.pairData[pair], candleData[pair], input)
	});

	console.log( state.pairSlots);
}

function handlePair( pair:string, state: any, candleData: ArrayCandle[], input: BotInput ){
	const {trader, plotter, utils} = input;
	const {pairSlots} = input.state;
	const {lastRenkoBlock} = state;

	if( !lastRenkoBlock ){
		state.priceSeed = trader.getPrice(pair);
		let renko = candlesToRenko( state.priceSeed, candleData, state.blockSize, utils );
		state.lastRenkoBlock = renko[renko.length - 1];
		plotter.plotSeries('renko', pair, state.lastRenkoBlock.close );
		return;
	}

	let [lastCandle] = candleData.slice(-1);
	let newBlocks = getNewBlocks(lastCandle[0], lastRenkoBlock, lastCandle[2], state.blockSize );
	if( newBlocks.length ){
		let [nextBlock] = newBlocks.slice(-1);
		let isUptrend = nextBlock.open < nextBlock.close;

		const {base, quoted} = utils.getPairAssets(pair);
		if( isUptrend && !pairSlots.includes(pair) && pairSlots.length < MAX_CONCURRENT_BUYS ){
			trader.placeOrder({
				type: 'market',
				direction: 'buy',
				pair,
				amount: (trader.getBalance(quoted).free * .45) / trader.getPrice(pair)
			});
			pairSlots.push(pair);
		}
		if( !isUptrend && pairSlots.includes(pair) ){
			trader.placeOrder({
				type: 'market',
				direction: 'sell',
				pair,
				amount: trader.getBalance(base).free
			})
			let index = pairSlots.indexOf(pair);
			let oldPair = [...pairSlots];
			pairSlots.splice(index, 1);
			console.log('Selling', oldPair, pairSlots)
		}

		state.lastRenkoBlock = newBlocks[newBlocks.length-1];
	}

	plotter.plotSeries('renko', pair, state.lastRenkoBlock.close );
}

function checkAlreadyBoughtPairs(quotedAsset: string, baseAssets: string[], state: any, trader: Trader ){
	let i = baseAssets.length;
	while( i-- > 0 && state.pairSlots.length < MAX_CONCURRENT_BUYS ){
		if( trader.getBalance(baseAssets[i]).free > 0 ){
			state.pairSlots.push( `${baseAssets[i]}/${quotedAsset}` );
		}
	}
}


function candlesToRenko( priceSeed: number, candles: ArrayCandle[], blockHeight: number, utils: BotRunUtils ): RenkoBlock[] {
	let blocks: RenkoBlock[] = [];

	candles.forEach( (candle: ArrayCandle) => {
		let [time, candleOpen, candleClose] = candle;

		if( !blocks.length ){
			let initialCandle = candles[0];
			let grid = utils.getGrid(initialCandle[2], blockHeight*100, 1 );
			if( grid.above[0] < candleClose ){
				blocks = createBlocks(time, grid.below[0], candleClose, blockHeight);
			}
			else if( grid.below[0] > candleClose ){
				blocks = createBlocks(time, grid.above[0], candleClose, blockHeight);
			}
		}
		else {
			let lastBlock = blocks[blocks.length -1];
			let isUptrend = lastBlock.open < lastBlock.close;

			if( isUptrend ){
				if( candleClose > lastBlock.close * (1 + blockHeight) ){
					blocks = [...blocks, ...createBlocks(time, lastBlock.close, candleClose, blockHeight) ]
				}
				else if( candleClose < lastBlock.open * (1 - blockHeight) ){
					blocks = [...blocks, ...createBlocks(time, lastBlock.open, candleClose, blockHeight)]
				}
			}
			else {
				if( candleClose < lastBlock.close * (1 - blockHeight) ){
					blocks = [...blocks, ...createBlocks(time, lastBlock.close, candleClose, blockHeight) ]
				}
				else if( candleClose > lastBlock.open * (1 + blockHeight) ){
					blocks = [...blocks, ...createBlocks(time, lastBlock.open, candleClose, blockHeight)]
				}
			}
		}
	});

	console.log(blocks)
	return blocks;
}

function getNewBlocks( time: number, lastBlock: RenkoBlock, currentPrice: number, blockHeight: number ): RenkoBlock[] {
	let isUptrend = lastBlock.open < lastBlock.close;
	let blocks:RenkoBlock[] = [];
	if( isUptrend ){
		if( currentPrice > lastBlock.close * (1 + blockHeight) ){
			blocks = [...blocks, ...createBlocks(time, lastBlock.close, currentPrice, blockHeight) ]
		}
		else if( currentPrice < lastBlock.open * (1 - blockHeight) ){
			blocks = [...blocks, ...createBlocks(time, lastBlock.open, currentPrice, blockHeight)]
		}
	}
	else {
		if( currentPrice < lastBlock.close * (1 - blockHeight) ){
			blocks = [...blocks, ...createBlocks(time, lastBlock.close, currentPrice, blockHeight) ]
		}
		else if( currentPrice > lastBlock.open * (1 + blockHeight) ){
			blocks = [...blocks, ...createBlocks(time, lastBlock.open, currentPrice, blockHeight)]
		}
	}

	return blocks;
}

function createBlocks( time: number, start: number, end: number, blockHeight: number ): RenkoBlock[] {
	let level = start;
	let blocks = [];
	
	if( start < end ){
		while( level * ( 1+blockHeight ) < end ){
			blocks.push({
				createdAt: time,
				open: level, 
				close: level * ( 1+blockHeight )
			});
			level = level * ( 1+blockHeight );
		}
	}
	else {
		while( level * (1-blockHeight) > end ){
			blocks.push({
				createdAt: time,
				open: level,
				close: level * ( 1-blockHeight)
			});
			level = level *( 1-blockHeight )
		}
	}
	return blocks;
}