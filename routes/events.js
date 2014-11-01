var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Event = mongoose.model("Event");

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

		res.send({"event":theEvent});
	});
});