const hourlyInterval = 100 * 60 * 60 * 1000;
const dailyInterval = hourlyInterval * 24;
const weeklyInterval = dailyInterval * 7;

const tickerTimer = {
	isHourlyTicker( timestamp: number ){
		return (new Date(timestamp) ).getMinutes() < 5;
	},

	isDailyTicker( timestamp: number ){
		let d = new Date(timestamp);
		return d.getHours() === 0 && this.isHourlyTicker(timestamp);
	},

	is10daysTicket( timestamp: number ){
		let d = new Date(timestamp);
		let days = d.getDate();
		return (days === 1 || days === 11 || days === 21) &&
			this.isDailyTicker(timestamp)
		;
	},

	get5minsTime( timestamp: number ){
		let d = new Date(timestamp);
		let minutes = d.getUTCMinutes();
		let rest = minutes % 5;
		d.setUTCMinutes( minutes - rest );
		d.setUTCSeconds(0);
		d.setUTCMilliseconds(0);
		return d.getTime();
	},

	getHourlyTime( timestamp: number ){
		let d = new Date(timestamp);
		d.setUTCMinutes(0);
		d.setUTCSeconds(0);
		d.setUTCMilliseconds(0);
		return d.getTime();
	},

	getDailyTime( timestamp: number ){
		let d = new Date(timestamp);
		d.setUTCHours(0);
		d.setUTCMinutes(0);
		d.setUTCSeconds(0);
		d.setUTCMilliseconds(0);
		return d.getTime();
	},

	getWeeklyTime( timestamp: number ){
		let d = new Date( this.getDailyTime(timestamp) );
		d.setUTCDate( d.getUTCDate() - d.getUTCDay() );
		return d.getTime();
	},

	getMonthlyTime( timestamp: number ){
		let d = new Date( this.getDailyTime(timestamp) );
		d.setUTCDate( 1 );
		return d.getTime();
	},

	get10DaysTime( timestamp: number ){
		let d = new Date(timestamp);
		let day = d.getUTCDate();
		if( day > 20 ){
			day = 21;
		}
		else if( day > 10){
			day = 11;
		}
		else {
			day = 1;
		}
		d.setUTCDate(day);
		d.setUTCHours(0);
		d.setUTCMinutes(0);
		d.setUTCSeconds(0);
		d.setUTCMilliseconds(0);
		return d.getTime();
	},

	getYearTime( timestamp: number ){
		let d = new Date(timestamp);
		d.setUTCMonth(0);
		d.setUTCDate(1);
		d.setUTCHours(0);
		d.setUTCMinutes(0);
		d.setUTCSeconds(0);
		d.setUTCMilliseconds(0);
		return d.getTime();
	},

	getTypeFromTimestamp(ts: number) {
		let now = Date.now();
		if( now - ts < hourlyInterval ) return 'hourly';
		if( now - ts < dailyInterval ) return 'daily';
		if( now - ts < weeklyInterval ) return 'weekly';
		return 'monthly';
	}
}

export default tickerTimer;