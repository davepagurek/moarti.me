function Event (start, end) {
	this.startTime = start;
	this.endTime = end;
}

function RankedInterval (time,rank) {
	this.interval = time;
	this.rank = rank;
}

/*
input format:
n: number of people
people: 2d array of Event objects (i = person index, j = event index)
*/
function timeRank (n,people) {
	var people = [];
	for (var i = 0; i < 3; i++) {
		//change to: convert Date objects to Time objects (i.e. make Bilal's parameters work with my objects) OR change my stuff to his format
		var busy = [];
		for (var j = 0; j < 5; j++) {
			//var start = new Time (Math.min(Math.floor(Math.random()*24),23),Math.min(Math.floor(Math.random()*60),59));
			var start = new Date();
			start.setHours(Math.min(Math.floor(Math.random()*24),23));
			start.setMinutes(Math.min(Math.floor(Math.random()*60),59));
			//var end = new Time (Math.min(Math.floor(Math.random()*24),23),Math.min(Math.floor(Math.random()*60),59));
			var end = new Date();
			end.setHours(Math.min(Math.floor(Math.random()*24),23));
			end.setMinutes(Math.min(Math.floor(Math.random()*60),59));
			if (end.getHours() == start.getHours()) {
				if (end.getMinutes() < start.getMinutes()) {
					busy.push(new Event(end,start));
				} else {
					busy.push(new Event(start,end));
				}
			} else if (end.getHours() < start.getHours()) {
				busy.push(new Event(end,start));
			} else {
				busy.push(new Event(start,end));
			}
		}
		//end
		busy.sort (function (a,b) {
			if (a.startTime.getHours() > b.startTime.getHours()) {
				return 1;
			} else if (b.startTime.getHours() > a.startTime.getHours()) {
				return -1;
			} else {
				if (a.startTime.getMinutes() > b.startTime.getMinutes()) {
					return 1;
				} else if (b.startTime.getMinutes() > a.startTime.getMinutes()) {
					return -1;
				} else {
					return 0;
				}
			}
		});
		//console.log(busy);
		people.push(busy); //delete this
	}

	//console.log(people[0].busy[0]);
	//console.log('\n');
	/*
	Algorithm:
	create a 24*60 array for each getMinutes() in a day
	value at each time represents the number of people free at that time
	rank them using those values

	swap:
	var temp = start;
	start = end;
	end = temp;
	*/

	/*
	3 levels of penalization:
	1: 0
	2: -n/2
	3: -n
	*/

	var times = new Array (24);
	for (var i = 0; i < 24; i++) {
		times[i] = new Array (60);
		for (var j = 0; j < 60; j++) {
			times[i][j] = 0;
		}
	}


	/* assumptions:
	-start time > end time
	-very last interval is inclusive on both ends
	*/

	people.forEach(function (person) {
		var cur = -1;
		for (var i = 0; i < 24; i++) {
			for (var j = 0; j < 60; j++) {
				if (person.length > 0) {
					if (cur < person.length-1) {
						if (i == person[cur+1].startTime.getHours() && j == person[cur+1].startTime.getMinutes()) {
							cur++;
						}
					}
					if (cur == -1) {
						if (person[0].startTime.getHours() > i) {
							times[i][j]++;
						} else if (person[0].startTime.getHours() == i) {
							if (person[0].startTime.getMinutes() > j) {
								times[i][j]++;
							}
						}
					} else if (cur == person.length-1) {
						if (person[cur].endTime.getHours() < i) {
							times[i][j]++;
						} else if (person[cur].endTime.getHours() == i) {
							if (person[cur].endTime.getMinutes() <= j) {
								times[i][j]++;
							}
						}
					} else {
						if (person[cur].endTime.getHours() < i && person[cur+1].startTime.getHours() > i) {
							times[i][j]++;
						} else if (person[cur].endTime.getHours() == i && person[cur+1].startTime.getHours() == i) {
							if (person[cur].endTime.getMinutes() <= j && person[cur+1].startTime.getMinutes() > j) {
								times[i][j]++;
							}
		 				} else if (person[cur].endTime.getHours() == i) {
		 					if (person[cur].endTime.getMinutes() <= j) {
		 						times[i][j]++;
		 					}
		 				} else if (person[cur+1].startTime.getHours() == i) {
		 					if (person[cur+1].startTime.getMinutes() > j) {
		 						times[i][j]++;
		 					}
		 				}
					}
				} else {
					times[i][j]++;
				}
			}
		}
	});

	/* for (var i = 0; i < 24; i++) {
		console.log(times[i].join(' '));
	} */

	var intervals = [];
	var start, end, cur;
	start = new Date();
	start.setHours(0);
	start.setMinutes(0);
	cur = times[0][0];
	for (var i = 0; i < 24; i++) {
		for (var j = 0; j < 60; j++) {
			if (times[i][j]!=cur) {
				end = new Date();
				end.setHours(i);
				end.setMinutes(j);
				intervals.push(new RankedInterval(new Event(start,end),cur));
				start = new Date();
				start.setHours(i);
				start.setMinutes(j);
				cur = times[i][j];
			}
		}
	}
	end = new Date();
	end.setHours(23);
	end.setMinutes(59);
	intervals.push(new RankedInterval(new Event(start,end),cur));

	/* console.log (intervals[0].interval.startTime);
	console.log (intervals[0].interval.endTime); */

	intervals.sort (function (a,b) {
		return b.rank - a.rank;
	});

	top = []; //[intervals[0].interval,intervals[1].interval,intervals[2].interval]];
	for (var i = 0; i < Math.min(3,intervals.length); i++) {
		top.push(intervals[i].interval);
	}
	/* console.log(top[0]);
	console.log(top[1]);
	console.log(top[2]); */
	return top;
}

module.export = {Event:Event,timeRank:timeRank};
