var model = require('../data/lecture');

module.exports = function(io) {
    io.sockets.on('connection', function (socket) {
		var isStudent = socket.handshake.headers.referer.split('/').slice(-2)[0] === 'class';
		var slug = socket.handshake.headers.referer.split('/').slice(-1)[0];
		if (isStudent) {
		    model.Lecture.findOne({
		      slug: slug
		    }, function(err, lecture) {
		      if (lecture) {
				slug = lecture._id;
				lecture.onNewStudent();
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
		io.to(slug).emit('news', { hello: 'world' });
    });
};