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
          lecture.createNewScore(1, 0);
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

    // This is an example of how to emit to everyone in the room
    io.to(slug).emit('news', {
      hello: 'world'
    });

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
      var newScore = lecture.createNewScore(dStudent, dConfused);
      io.to(slug).emit('status update', newScore);
    });

    socket.on('disconnect', function() {
      var dStudent = -1;
      var dConfused = 0;
      if (studentStatus == StudentStateEnum.Confused) {
        dConfused = 1;
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
