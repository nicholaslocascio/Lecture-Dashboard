var model = require('../data/lecture');

var StudentStateEnum = {
  "Confused": "Confused",
  "IGetIt": "IGetIt"
};
module.exports = function(io) {
  io.sockets.on('connection', function(socket) {
    var isStudent = socket.handshake.headers.referer.split('/').slice(-2)[0] === 'class';
    var studentStatus = StudentStateEnum.IGetIt;
    var slug = socket.handshake.headers.referer.split('/').slice(-1)[0];
    if (isStudent) {
      model.Lecture.findOne({
        slug: slug
      }, function(err, lecture) {
        if (lecture) {
          slug = lecture._id;
          var newScore = lecture.createNewScore(1, 0);
          socket.emit('student connected', lecture.scores);
          io.to(slug).emit('status update', newScore);
        }
      });
    } else {
      model.Lecture.findOne({
        _id: slug
      }, function(err, lecture) {
        if (lecture) {
          socket.emit('lecture', lecture);
        }
      });
    }

    socket.join(slug);

    socket.on('status update', function(msg) {
      if (!isStudent) {
        return;
      }
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
        _id: slug
      }, function(err, lecture) {
        var newScore = lecture.createNewScore(dStudent, dConfused);
        io.to(slug).emit('status update', newScore);
      });
    });

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
        _id: slug
      }, function(err, lecture) {
        var newScore = lecture.createNewScore(dStudent, dConfused);
        io.to(slug).emit('status update', newScore);
      });
    });
  });
};
