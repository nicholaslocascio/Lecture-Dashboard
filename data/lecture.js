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
  scores: [scoreSchema]
});

lectureSchema.methods.createNewScore = function(totalDelta, confusedDelta){
	console.log("hello");
	if (this.scores.length != 0){
		var lastScore = this.scores[this.scores.length-1];
	}
	lastScore = lastScore || {total:0, confused:0};
	var newScore = new Score({
		total:lastScore.total+totalDelta,
		confused: lastScore.confused+confusedDelta
	});
	this.scores.push(newScore);
	this.save();
	return newScore;
};

var Lecture = mongoose.model('Lecture', lectureSchema);

exports.Lecture = Lecture;
