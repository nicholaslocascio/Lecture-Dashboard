$(function() { 
	var socket = io.connect();

	// This is an example of how to receive an event in the client
	socket.on('news', function (data) {
	    console.log(data);
	});
});
