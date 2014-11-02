var express = require('express');
var path = require("path");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	if (req.user === undefined) {
		res.sendFile(path.resolve(__dirname, "../views/index.html"));
	} else {
		res.sendFile(path.resolve(__dirname, "../views/create.html"));
	}

});

module.exports = router;
