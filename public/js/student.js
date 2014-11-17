Handlebars.registerPartial('lectureDetails', Handlebars.templates['lectureDetails']);
Handlebars.registerPartial('footer', Handlebars.templates['footer']);
Handlebars.registerPartial('header', Handlebars.templates['header']);

$(document).ready(function(){
	initializeLectureComponents();
  	initializeStaticComponents();

})
function initializeStaticComponents(){
	$("#header-container").html(Handlebars.templates["header"]({}))
	$("#footer-static").html(Handlebars.templates["footer"]({}))
}

function initializeLectureComponents(){
	event.preventDefault();
	var slug = window.location.pathname.split("class/")[1];
    var url = '/api/session';
    console.log(url);
    criteria = {"slug":slug}
    // jQuery AJAX call for JSON
    $.getJSON( url, criteria).done( function( data ) {
    	data = data || {};
    	$("#lectureDetails-container").html(Handlebars.templates["lectureDetails"](data));
    });
}