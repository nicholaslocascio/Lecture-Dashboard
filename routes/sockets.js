module.exports = function(io) {
    io.sockets.on('connection', function (socket) {
        console.log("Client Connected");
		socket.on('event', function(data) {
            console.log(data);
            socket.emit('event');
        });
    });
};