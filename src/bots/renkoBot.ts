interface RenkoBlock {
	createdAt: number
	open: number
	close: number
}

function initializeState( config, state ){
	state.lastRenkoBlock = false;
	state.priceSeed = false;
}


function onData({ candleData, state, plotter, config, trader, utils }: BotInput ) {
  const pair = config.pairs[0];

	if( !state.lastRenkoBlock ){
		state.priceSeed = trader.getPrice(pair);
		let renko = candlesToRenko( state.priceSeed, candleData[pair], .02, utils );
		state.lastRenkoBlock = renko[renko.length - 1];
		plotter.plotSeries('renko', pair, state.lastRenkoBlock.close );
		return;
	}

	let [lastCandle] = candleData[pair].slice(-1);
	let newBlocks = getNewBlocks(lastCandle[0], state.lastRenkoBlock, lastCandle[2], .02 );
	if( newBlocks.length ){
		state.lastRenkoBlock = newBlocks[newBlocks.length-1];
	}

	plotter.plotSeries('renko', pair, state.lastRenkoBlock.close );
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