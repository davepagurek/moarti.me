var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var Event = mongoose.model("Event");
var User = mongoose.model("User");
var CalEvent = mongoose.model("CalEvent");
var Q = require("q");

var timerank = require("./timerank2");

var gcal = require("google-calendar");

router.get('/event/:id/view', function(req, res){
	if (!req.user || req.user === undefined) {
		res.sendFile(path.resolve(__dirname, "../public/eventLoggedOut.html"));
	} else {
		res.sendFile(path.resolve(__dirname, "../public/event.html"));
	}
});

router.get('/event/:id', function(req, res){
	var id = req.params.id;

	Event.findById(id).populate("user", "displayName").exec(function(err, theEvent){
		if (err || theEvent === undefined) {
			res.status(404).send({"error": "Wrong id"});
		}

		var response = {
			event: {
				id: theEvent._id,
				user: {
					id: theEvent.user._id,
					displayName: theEvent.user.displayName
				},
				title: theEvent.title,
				start: theEvent.start,
				end: theEvent.end
			}
		};

		var promises = theEvent.attendees.map(function(attendeeId){
			return Q.ninvoke(User.findById(attendeeId, "displayName"), "exec");
		});

		Q.all(promises)
			.then(function(attendees){
				response.event.attendees = attendees.map(function(attendee){
					return {
						id: attendee._id,
						displayName: attendee.displayName
					};
				});
				res.send(response);
			})
			.done();
	});
});

router.use(function(req, res, next) {
	if (!req.user || req.user === undefined) {
		if (req.xhr) {
			res.status(401).send({"error": "Unauthorized"});
		} else {
			res.redirect("/");
		}
	} else {
		next();
	}
});

/*router.get('/event/:id/attendees', function(req, res) {
	var id = req.body.id;

	Event.findById(id, function(err, theEvent) {
		if (err || theEvent === undefined) {
			res.status(404).send({"error": "Wrong id"});
		}


	});
});*/

router.get('/event/:id/admin', function(req, res){
	res.sendFile(path.resolve(__dirname, "../public/eventAdmin.html"));
});

router.post('/new', function(req, res){
	var userId = req.user._id;
	var title = req.body.title;
	var start = new Date(req.body.start);
	var end = new Date(req.body.end);

	end.setFullYear(start.getFullYear());
	end.setMonth(start.getMonth());
	end.setDate(start.getDate());

	var theEvent = new Event({
		user: userId,
		title: title,
		start: start,
		end: end,
		attendees: [userId]
	});

	theEvent.save(function(err, newEvent){
		if (!err) {
			res.send({success: 1, id: newEvent.id});
		}
	});
});

router.post('/event/:id/addCalendar', function(req, res){
	var id = req.params.id;

	var google_calendar = new gcal.GoogleCalendar(req.user.accessToken);
	
	Event.findById(id, function(err, theEvent){
		if (!req.user._id.equals(theEvent.user)){
			theEvent.attendees.push(req.user._id);
			theEvent.save();
		}

		google_calendar.calendars.get("primary", function(err, calendar){
			google_calendar.events.list(calendar.id, {timeMin: theEvent.start.toISOString(),
			timeMax: theEvent.end.toISOString()},
			function(err, response){
				var items = response.items;

				var processEvent = function(gCalEvent) {
					if (!gCalEvent || !gCalEvent.start || !gCalEvent.end) {
						return;
					}

					var startDate = new Date(gCalEvent.start.dateTime || gCalEvent.start.date);
					var endDate = new Date(gCalEvent.end.dateTime || gCalEvent.start.date);

					if ((endDate.getFullYear() + endDate.getMonth() + endDate.getDate())
						>
						(startDate.getFullYear() + startDate.getMonth() + startDate.getDate())) {
						endDate = new Date(startDate);
						endDate.setHours(23);
						endDate.setMinutes(59);
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
	var eventId = req.params.id;

	Event.findById(eventId, function(err, theEvent){
		if (err || !theEvent || !theEvent.user.equals(req.user._id)) {
			res.status(404).send();
			return;
		}

		CalEvent.find({_event: eventId}, function(err, calEvents) {

			var abhishekInput = calEvents.map(function(calEvent){
				return new timerank.Event(calEvent.start, calEvent.end);
			});

			var eventInterval = new timerank.Event(theEvent.start, theEvent.end);

			console.log(eventInterval);

			var output = timerank.timeRank(theEvent.attendees.length, abhishekInput, eventInterval);
			res.send({
				niceTimes: output
			});
		});
	});
});

module.exports = router;

