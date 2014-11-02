var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Event = mongoose.model("Event");
var User = mongoose.model("User");
var CalEvent = mongoose.model("CalEvent");
var Q = require("q");

var gcal = require("google-calendar");

router.get('/event/:id', function(req, res){
	var id = req.params.id;

	Event.findById(id, function(err, theEvent){
		var isAttendee = theEvent.attendees.some(function(attendeeId){
			return attendeeId.equals(req.user._id);
		});

		var promises = theEvent.attendees.map(function(attendeeId){
			return Q.ninvoke(User.findById(attendeeId, "displayName"), "exec");
		});

		Q.all(promises)
			.then(function(attendees){
				theEvent.attendees = attendees;
				res.send({"event":theEvent});
			})
			.done();
	});
});

router.post('/new', function(req, res){
	var userId = req.user._id;
	var title = req.body.title;
	var start = new Date(req.body.start);
	var end = new Date(start.getTime() + 24*60*60*1000);

	var theEvent = new Event({
		user: userId,
		title: title,
		start: start,
		end: end
	});

	theEvent.save(function(err){
		if (!err) {
			res.send({success: 1});
		}
	});
});

router.post('/event/:id/addCalendar', function(req, res){
	var id = req.params.id;

	var google_calendar = new gcal.GoogleCalendar(req.user.accessToken);
	
	Event.findById(id, function(err, theEvent){
		google_calendar.calendars.get("primary", function(err, calendar){
			google_calendar.events.list(calendar.id, function(err, response){
				var items = response.items;

				var processEvent = function(gCalEvent) {
					if (!gCalEvent || !gCalEvent.start || !gCalEvent.end) {
						return;
					}
					var calEvent = new CalEvent({
						_event: theEvent._id,
						_user: req.user._id,
						start: new Date(gCalEvent.start.dateTime || gCalEvent.start.date),
						end: new Date(gCalEvent.end.dateTime || gCalEvent.start.date)
					});

					calEvent.save();
				};

				if (items) {
					for (var i=0; i<items.length; i++) {
						processEvent(items[i]);
					}
				} else if (response) {
					items = JSON.parse(response).items;
					items.forEach(processEvent);
				}
				
				res.status(200).send({success:1});
			});
		});
	});
});

router.post('/event/:id/calculate', function(req, res){

});

module.exports = router;

