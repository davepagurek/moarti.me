var express = require('express');
var path = require("path");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	if (!req.user || req.user === undefined) {
		res.sendFile(path.resolve(__dirname, "../public/index.html"));
	} else {
		res.sendFile(path.resolve(__dirname, "../public/create.html"));
	}

});

module.exports = router;
