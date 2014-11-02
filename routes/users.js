var express = require('express');
var router = express.Router();
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

module.exports = router;
