$(function() { 
	var socket = io.connect();
	socket.on('lecture', function (lecture) {
	    $('#link-text').val('http://' + window.location.host + '/class/' + lecture.slug);
	});

	// This is an example of how to receive an event in the client
	socket.on('news', function (data) {
	    console.log(data);
	});
});
