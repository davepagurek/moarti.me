var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Event = mongoose.model("Event");
var User = mongoose.model("User");
var Q = require("q");

router.get('/event/:id', function(req, res){
	var id = req.params.id;

	Event.findById(id, function(err, theEvent){
		var isAttendee = theEvent.attendees.some(function(attendeeId){
			return attendeeId.equals(req.user._id);
		});

		if (!isAttendee) {
			res.status(401).send({error: "Unauthorized"});
			return;
		}

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

router.post('/event/new', function(req, res){
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
	
});

router.post('/event/:id/calculate', function(req, res){

});

