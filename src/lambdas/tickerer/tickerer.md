The ticker will gather information about the exchanges, their currencies, trading pairs, and store the prices to do the price conversion at any point in the past.

All these entities will be stored in s3 files, in folders with the name of the exchange. Entities to save:

* lastPrices for all symbols -> From the ticker, updated every 5 minutes
	- Object { symbol: {date, price, volume} }
	- filename: prices.json

* historic prices for one symbol. 3 granularities -> 1h, 1d, 10d
	- Object { date: {price, volume}
	- filenames:
		* hourly-{daytimestamp}.json <- saved for 10 days
		* daily-{10daytimestamp}.json
		* tendays-{yeartimestapm}.json

* symbols -> Updated every 5 minutes
	- Object: { symbol: {symbolKey, minOrder, maxOrder} }


