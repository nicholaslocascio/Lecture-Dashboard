Handlebars.registerPartial('lectureDetails', Handlebars.templates['lectureDetails']);
Handlebars.registerPartial('footer', Handlebars.templates['footer']);

$(document).ready(function(){

  $("#lectureDetails-container").html(Handlebars.templates["lectureDetails"]({}))
  $("#footer-static").html(Handlebars.templates["footer"]({}))

})
