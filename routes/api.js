/*
REST API for Lecture Dashboard
All server and database interaction described below

*/

var express = require('express');
var model = require('../data/model');
var router = express.Router();

/*
Create a new lecture session
POST /api/lecture/new
Request parameters:
    name: (String) name of the professor
  <- FILL THIS OUT ->
Response:
    success(200): returns the newly creaeted lecture object 
    error(500);  returns error message
*/
router.post('/lecture/new', function(req, res) {
  var className = req.body.class;
  var lecturerName = req.body.lecturer;
  var topic = req.body.topic;

  var randomString = require('random-string');
  var randomSlug = randomString({
    length: 6
  });
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
Create a new lecture session
GET /api/session/new
Request parameters:
    slug: (String) name of the professor
  <- FILL THIS OUT ->
Response:
    success(200): returns the newly creaeted lecture object 
    error(500);  returns error message
*/
router.get('/session/:id', function(req, res) {
    var db = req.db;
    var id = JSON.stringify(req.params.id);
    var userCriteria = {"_id":id};
    console.log(userCriteria)
    db.collection('Lecture').findOne(userCriteria,function (err,item){
      res.json(item);
    });
});

module.exports = router;
