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
        var lectureUrl = '/session/' + data._id;
        window.location.replace(lectureUrl);
      }
    });
  });
});
