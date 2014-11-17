var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var scoreSchema = new Schema({
  total: Number,
  confused: Number,
});
scoreSchema.plugin(timestamps);
var Score = mongoose.model('Score', scoreSchema);

var lectureSchema = new Schema({
  slug: String,
  className: String,
  lecturerName: String,
  topic: String,
  scores: [Score]
});

lectureSchema.methods.createNewScore = function(totalDelta, confusedDelta){
	console.log("hello");
	var newScore = new Score({
		total:5,
		confused: 3
	});
	newScore.save();
};

scoreSchema.post('save', function(doc){
	console.log(JSON.stringify(doc));
});

var Lecture = mongoose.model('Lecture', lectureSchema);

exports.Lecture = Lecture;
