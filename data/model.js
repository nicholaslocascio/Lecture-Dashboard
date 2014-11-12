var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var lectureSchema = new Schema({
	slug : String
}); 

var Lecture = mongoose.model('Lecture', lectureSchema);

exports.Lecture = Lecture;