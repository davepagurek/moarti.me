var express = require('express');
var router = express.Router();
var path = require('path');
var passport = require('passport');

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

router.get('/me/', function(req, res){
	res.sendFile(path.resolve(__dirname, "../public/profile.html"));
});

module.exports = router;
