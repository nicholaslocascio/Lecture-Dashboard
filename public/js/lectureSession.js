Handlebars.registerPartial('lectureDetails', Handlebars.templates['lectureDetails']);
Handlebars.registerPartial('footer', Handlebars.templates['footer']);
Handlebars.registerPartial('header', Handlebars.templates['header']);
Handlebars.registerPartial('lectureFooter', Handlebars.templates['lectureFooter']);
Handlebars.registerPartial('sessionLinks', Handlebars.templates['sessionLinks']);

$(document).ready(function() {

  initializeMain();
  initializeStaticComponents();
  initializeLectureComponents();
});

function initializeMain() {
  $("#sessionLinks-container").html(Handlebars.templates["sessionLinks"]({}));
}

function initializeStaticComponents() {
  $("#header-container").html(Handlebars.templates["header"]({}));
  $("#footer-static").html(Handlebars.templates["footer"]({}));
}

function initializeLectureComponents() {
  var url = '/api/session';
  var sessionId = window.location.pathname.split("session/")[1];
  console.log(sessionId);
  var criteria = {
    "id": sessionId
  };
  // jQuery AJAX call for JSON
  $.getJSON(url, criteria).done(function(data) {
    data = data || {};
    $("#lectureDetails-container").html(Handlebars.templates["lectureDetails"](data));
    $("#lectureFooter-container").html(Handlebars.templates["lectureFooter"](data));
  });

}
