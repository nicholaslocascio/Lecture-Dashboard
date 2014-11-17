Handlebars.registerPartial('lectureDetails', Handlebars.templates['lectureDetails']);
Handlebars.registerPartial('footer', Handlebars.templates['footer']);
Handlebars.registerPartial('header', Handlebars.templates['header']);
Handlebars.registerPartial('lectureFooter', Handlebars.templates['lectureFooter']);
Handlebars.registerPartial('sessionLinks', Handlebars.templates['sessionLinks']);

$(document).ready(function(){
  	
	initializeMain()



})
function initializeMain(){
	$("#header-container").html(Handlebars.templates["header"]({}))
	$("#lectureFooter-container").html(Handlebars.templates["lectureFooter"]({}))
	$("#footer-static").html(Handlebars.templates["footer"]({}))
	$("#sessionLinks-container").html(Handlebars.templates["sessionLinks"]({}))
	$("#lectureDetails-container").html(Handlebars.templates["lectureDetails"]({}))
	event.preventDefault();

    var url = '/api' + window.location.pathname;

    console.log( url);
    // jQuery AJAX call for JSON
    $.getJSON( url, function( data ) {
    	console.log("data");
    	console.log(data);
    });
}
