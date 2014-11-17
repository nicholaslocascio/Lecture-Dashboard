Handlebars.registerPartial('lectureDetails', Handlebars.templates['lectureDetails']);
Handlebars.registerPartial('footer', Handlebars.templates['footer']);
Handlebars.registerPartial('header', Handlebars.templates['header']);

$(document).ready(function(){
  $("#header-container").html(Handlebars.templates["header"]({}))
  $("#lectureDetails-container").html(Handlebars.templates["lectureDetails"]({}))
  $("#footer-static").html(Handlebars.templates["footer"]({}))

})