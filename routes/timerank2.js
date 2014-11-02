function Event (start, end) {
	this.startTime = start;
	this.endTime = end;
}

function RankedInterval (time,rank) {
	this.interval = time;
	this.rank = rank;
}

function getMinutesBetween(a, b) {
	return Math.floor((b.getTime()-a.getTime())/60000)
}

function timeRank (n,events,bounds) {
	var startTime = bounds.startTime;
	var noOfMinutes = getMinutesBetween(bounds.startTime, bounds.endTime);

	var minutes = [];

	for (var i=0; i<noOfMinutes; i++) {
		minutes[i] = 3;
	}

	console.log(events);

	events.forEach(function(theEvent){
		var startMin = getMinutesBetween(bounds.startTime, theEvent.startTime);
		var endMin = getMinutesBetween(bounds.startTime, theEvent.endTime);

		if (startMin < 0) {
			startMin = 0;
		}

		if (endMin > noOfMinutes) {
			endMin = noOfMinutes;
		}

		for (var i=startMin; i<endMin; i++) {
			minutes[i] -= 3/n;
		}
	});

	var intervals = [];
	var cur;
	cur = minutes[0];
	var startMin = 0;
	var endMin;
	for (var i = 0; i < noOfMinutes; i++) {
		if (minutes[i]!=cur) {
			intervals.push(new RankedInterval({startMin: startMin,endMin:(i-1)},cur));
			startMin = i;
			cur = minutes[i];
		}
	}
	intervals.push(new RankedInterval({startMin: startMin,endMin:noOfMinutes},cur));

	intervals.sort (function (a,b) {
		return b.rank - a.rank;
	});

	console.log(intervals);

	var finalIntervals = [];
	for (var i=0; i < 3 && i < intervals.length; i++) {
		var interval = intervals[i];
		finalIntervals.push({
			startTime: new Date(startTime.getTime() + interval.interval.startMin*60000),
			endTime: new Date(startTime.getTime() + interval.interval.endMin*60000)
		});
	}

	return finalIntervals;
}

module.exports = {Event:Event,timeRank:timeRank};