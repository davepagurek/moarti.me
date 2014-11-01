
var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/moartime');

var User = mongoose.model('User', {
    identifier: String,
    displayName: String,
    email: String
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

var 