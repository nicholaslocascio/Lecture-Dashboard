var self = this;
self.HUH = self.HUH || {};
var HUH = self.HUH;

$(function() {
  var socket = io.connect();
  socket.on('lecture', function(lecture) {
    $('#link-text').val('http://' + window.location.host + '/class/' + lecture.slug);
    var scores = lecture.scores;
    var score = scores[scores.length - 1];
    if (score) {
      $('#listeners').html(score.total);
    }
    initGraphScores(scores);
  });

  var initGraphScores = function(scores) {
    for (var i in scores) {
      var score = scores[i];
      HUH.Graph.updateCurrentChartValueFromData(score);
      HUH.Graph.addScoreToChart();
    }
  };

  socket.on('student connected', function(scores) {
    initGraphScores(scores);
  });

  // This is an example of how to receive an event in the client
  socket.on('status update', function(data) {
    $('#listeners').html(data.total);
    HUH.Graph.updateCurrentChartValueFromData(data);
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
