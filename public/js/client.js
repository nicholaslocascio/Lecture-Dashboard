var self = this;
self.HUH = self.HUH || {};
var HUH = self.HUH;

$(function() {
  var socket = io.connect();
  socket.on('lecture', function(lecture) {
    $('#link-text').val('http://' + window.location.host + '/class/' + lecture.slug);
  });

  // This is an example of how to receive an event in the client
  socket.on('news', function(data) {
    console.log(data);
  });

  // This is an example of how to receive an event in the client
  socket.on('status update', function(data) {
    console.log(data);
    $('#listeners').val(data.total);
    //HUH.GRAPH.updateWithNewScore(score);
  });

  $('.huh-button').click(function() {
    socket.emit('status update');
    if ($(this).hasClass('green-button')) {
      $(this).removeClass('green-button');
      $(this).text('Huh?');
    } else {
      $(this).addClass('green-button');
      $(this).text('I get it!');
    }
  });
});
