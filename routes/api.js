var ObjectId = require('mongodb').ObjectID;
/*
REST API for Lecture Dashboard
All server and database interaction described below

*/

var express = require('express');
var model = require('../data/lecture');
var router = express.Router();

/*
Create a new lecture session
POST /api/lecture/new
Request parameters:
    className: (String) name of the class
	lecturerName: (String) name of the lecturer
	topic: (String) topic of the class
Response:
    success(200): returns the newly creaeted lecture object 
    error(500);  returns error message
*/
router.post('/lecture/new', function(req, res) {
  var className = req.body.className;
  var lecturerName = req.body.lecturerName;
  var topic = req.body.topic;

  var adjNoun = require('adj-noun');

  // seed it so your pairs are different than someone else using this lib
  var d = new Date();
  var n = d.getTime();
  adjNoun.seed(n);
  // -> true

  var randomSlug = adjNoun().join('-');
  var newLecture = new model.Lecture({
    slug: randomSlug,
    className: className,
    lecturerName: lecturerName,
    topic: topic
  });

  newLecture.save(function(err, lecture) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(lecture);
    }
  });
});

/*
Returns the lecture session object
GET /api/session/
Request parameters:
    id: (String) the id or slug of the session
Response:
    success(200): returns the lecture object 
    error(500);  returns error message
*/
router.get('/session', function(req, res) {
  var db = req.db;
  var userCriteria;
  if (req.query.id) {
    userCriteria = {
      "_id": req.query.id
    };
  } else if (req.query.slug) {
    userCriteria = {
      "slug": req.query.slug
    };
  }
  model.Lecture.findOne(userCriteria, function(err, item) {
    res.json(item);
  });
});


module.exports = router;
