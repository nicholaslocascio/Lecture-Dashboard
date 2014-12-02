/*
	Website pages described below

	Author: Kulpreet
*/

var express = require('express');
var model = require('../data/lecture');
var router = express.Router();

/*
Returns landing + lecture creation page
GET /
*/
router.get('/', function(req, res) {
  res.render('index');
});

/*
Returns the lecture session page for the lecturer
GET /session/:id
Request parameters:
    id: (String) the _id of the lecture object
Response:
    success(200): returns the session page for the lecturer
    error(404);  returns error if the lecture with id does not exist
*/
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

/*
Returns the lecture session page for the audience
POST /class/:slug
Request parameters:
    slug: (String) the short URL slug for that lecture object
Response:
    success(200): returns the session page for the audience
    error(404);  returns error if the lecture with slug does not exist
*/
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

/*
Returns API test page
GET /test
*/
router.get('/test', function(req, res) {
  res.render('test');
});

module.exports = router;
