/*
	Author: Kulpreet
*/

var express = require('express');
var model = require('../data/lecture');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/session/:id', function(req, res) {
  var session = req.params.id;
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

router.get("/class/:slug", function(req, res) {
  var slug = req.params.slug;
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
