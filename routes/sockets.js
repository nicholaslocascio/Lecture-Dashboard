var model = require('../data/lecture');

var StudentStateEnum = {
  "Confused": "Confused",
  "IGetIt": "IGetIt"
};

module.exports = function(io) {
	
  // Return lecture object if audience member connects
  // Update score for all connected audience members
  io.sockets.on('connection', function(socket) {
    var isStudent = socket.handshake.headers.referer.split('/').slice(-2)[0] === 'class';
    var studentStatus = StudentStateEnum.IGetIt;
    var headerParam = socket.handshake.headers.referer.split('/').slice(-1)[0];
    var lectureId;
    if (isStudent) {
      model.Lecture.findOne({
        slug: headerParam
      }, function(err, lecture) {
        if (lecture) {
          lectureId = lecture._id;
          socket.join(lectureId);
          socket.emit('lecture', lecture);
          var newScore = lecture.createNewScore(1, 0);
          socket.emit('student connected', lecture.scores);
          io.to(lectureId).emit('status update', newScore);
        }
      });
    } else {
      model.Lecture.findOne({
        _id: headerParam
      }, function(err, lecture) {
        if (lecture) {
          lectureId = lecture._id;
          socket.join(lectureId);
          socket.emit('lecture', lecture);
        }
      });
    }
	
	// Upon receiving a status update - inform all connected clients
    socket.on('status update', function(msg) {
      var dStudent = 0;
      var dConfused = 0;
      if (studentStatus == StudentStateEnum.Confused) {
        studentStatus = StudentStateEnum.IGetIt;
        dConfused = -1;
      } else {
        studentStatus = StudentStateEnum.Confused;
        dConfused = 1;
      }
      model.Lecture.findOne({
        _id: lectureId
      }, function(err, lecture) {
        var newScore = lecture.createNewScore(dStudent, dConfused);
        io.to(lectureId).emit('status update', newScore);

      });
    });

	// Update score for all clients if audience member disconnects
    socket.on('disconnect', function() {
      if (!isStudent) {
        return;
      }
      var dStudent = -1;
      var dConfused = 0;
      if (studentStatus == StudentStateEnum.Confused) {
        dConfused = -1;
      }
      model.Lecture.findOne({
        _id: lectureId
      }, function(err, lecture) {
        var newScore = lecture.createNewScore(dStudent, dConfused);
        io.to(lectureId).emit('status update', newScore);
      });
    });
  });
};
