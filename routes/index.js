/*
	Author: Kulpreet
*/

var express = require('express');
var model = require('../data/model');
var router = express.Router();

router.get('/', function(req, res) {
	res.render('index');
});

router.get('/login', function(req, res) {
   res.render('login');
});

router.get('/test', function(req, res) {
   res.render('test');
});

module.exports = router;
