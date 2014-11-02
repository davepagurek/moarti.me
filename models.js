
var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/moartime');

var User = mongoose.model('User', {
    googleId: String,
    accessToken: String,
    refreshToken: String,
    displayName: String,
    email: String,

    photoLink: String
});

var Event = mongoose.model('Event', {
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	title: String,
	start: Date, 
	end: Date,

	attendees: [
		mongoose.Schema.Types.ObjectId
	]
});

var CalEvent = mongoose.model('CalEvent', {
	_event: {type: mongoose.Schema.Types.ObjectId, ref: "Event"},
	_user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
	start: Date,
	end: Date
});