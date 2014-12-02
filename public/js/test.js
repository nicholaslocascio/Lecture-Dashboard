/*
AJAX Tests for YouTube Jukebox API

Author: Kulpreet
*/

$(document).ready(function() {
		
	// Testing Lecture Session Creation and Retreival

	$.ajax({
	    type: 'POST',
	    url: '/api/lecture/new',
	    async: false,
	    data: { 
	        className: "6.170", 
	        lecturerName: "Daniel Jackson", 
	        topic: "Closures" 
	    },
	    success: function(data){
	        lectureID = data._id;
	        console.log('Tested POST /lecture/new');
	        console.log('Host created lecture ' + lectureID);
			
			$.ajax({
			    type: 'GET',
			    url: '/api/session',
			    async: false,
			    data: { 
			        id: lectureID
			    },
			    success: function(data){
			        console.log('Tested GET /lecture/new');
			        console.log(data);
			    },
			    error: function(req, textStatus, error) {
			        console.log(textStatus);
			        console.log(error);
			    }
			});
			
	    },
	    error: function(req, textStatus, error) {
	        console.log(textStatus);
	        console.log(error);
	    }
	});
	
});
