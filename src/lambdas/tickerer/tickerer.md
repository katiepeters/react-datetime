The ticker will gather information about the exchanges, their currencies, trading pairs, and store the prices to do the price conversion at any point in the past.

All these entities will be stored in s3 files, in folders with the name of the exchange. Entities to save:

* lastPrices for all pairs -> From the ticker, updated every 5 minutes
	- Object { pair: {date, price, volume} }
	- filename: prices.json

* historic prices for one pair. 3 granularities -> 1h, 1d, 10d
	- Object { date: {price, volume}
	- filenames:
		* hourly-{daytimestamp}.json <- saved for 10 days
		* daily-{10daytimestamp}.json
		* tendays-{yeartimestapm}.json

* pairs -> Updated every 5 minutes
	- Object: { pair: {pairKey, minOrder, maxOrder} }


