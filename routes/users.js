var express = require('express');
var router = express.Router();
var path = require('path');
var passport = require('passport');
var request = require('request');

var mongoose = require('mongoose');
var User = mongoose.model("User");

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/test/', function(req, res){
	res.send("Your name is: "+req.user.displayName);
});

router.get('/profile/', function(req, res){
	res.send({user: req.user});
});

router.get('/user/:id/photo', function(req, res){
	if (!req.user) {
		res.status(401).send({error: "Unauthorized"});
	} else {
		User.findById(req.params.id, function(err, user){
			if (user.photoLink !== undefined) {
				res.redirect(user.photoLink);
			} else {
				request("https://www.googleapis.com/plus/v1/people/"+user.googleId+"?access_token="+req.user.accessToken, function(error, response, body){
					if (!error && response.statusCode === 200) {
						request(JSON.parse(body).image.url).pipe(res);
					}
				});
			}
		});
	}
});

router.get('/me/', function(req, res){
	res.sendFile(path.resolve(__dirname, "../public/profile.html"));
});

module.exports = router;
