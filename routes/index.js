/*
	Author: Kulpreet
*/

var express = require('express');
var model = require('../data/model');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index');
});

router.get(new RegExp('session\/(.+)'), function(req, res) {
  var session = req.params[0];
  model.Lecture.findOne({
    _id: session
  }, function(err, lecture) {
    if (lecture) {
      res.render('session');
    } else {
      return res.send(404);
    }
  });
});

router.get(new RegExp('class\/(.+)'), function(req, res) {
  var slug = req.params[0];
  model.Lecture.findOne({
    slug: slug
  }, function(err, lecture) {
    if (lecture) {
      res.render('student');
    } else {
      return res.send(404);
    }
  });
});

router.get('/test', function(req, res) {
  res.render('test');
});

module.exports = router;
