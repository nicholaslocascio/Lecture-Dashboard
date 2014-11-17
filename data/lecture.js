var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var scoreSchema = new Schema({
  total: Number,
  confused: Number,
});
scoreSchema.plugin(timestamps);

var lectureSchema = new Schema({
  slug: String,
  className: String,
  lecturerName: String,
  topic: String,
  scores: [scoreSchema]
});

lectureSchema.methods.onNewStudent = function(){
	console.log("hello");
};

var Lecture = mongoose.model('Lecture', lectureSchema);

exports.Lecture = Lecture;
