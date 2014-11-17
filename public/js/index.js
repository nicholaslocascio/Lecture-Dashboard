//Handlebars.registerPartial('lectureForm', Handlebars.templates['lectureForm']);

$(document).ready(function(){
  //$(".form-container").html(Handlebars.templates["lectureForm"]({}))
})
$(function() {
  $("#createLectureForm").submit(function(event) {

    event.preventDefault();
    var $form = $(this);
    var url = '/api' + $form.attr('action');

    var post = $.post(url, {
      topic: $('#topic').val(),
      className: $('#className').val(),
      lecturerName: $('#lecturerName').val()
    });

    post.done(function(data) {
      if (data) {
       console.log(data);
        var lectureUrl = '/session/' + data._id;
        window.location.replace(lectureUrl);
      }
    });
  });
});
