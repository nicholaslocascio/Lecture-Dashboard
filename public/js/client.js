var self = this;
self.HUH = self.HUH || {};
var HUH = self.HUH;
HUH.scores = [];

$(function() {
  var socket = io.connect();
  socket.on('lecture', function(lecture) {
    var url = 'http://' + window.location.host + '/class/' + lecture.slug;
    $('#link-text').val(url);
    $('#linkanchor').attr("href", url);
    var scores = lecture.scores;
    var score = scores[scores.length - 1];
    if (score) {
      $('#listeners').html(score.total);
    }
    updateUnderstandingFromScore(score);
    HUH.Series.initSeriesWithPoints(scores);
  });
  var sigmoid = function(x) {
    return (1.0 / (1.0 + Math.exp(-(10 * (x - 0.5)))));
  };

  var updateUnderstandingFromScore = function(score) {
    if (score && score.total > 0) {
      $('#understanding').html((100 * (1 - (score.confused / score.total))).toPrecision(3) + " %");
      var value = HUH.Series.valueFromScore(score);
      var greenHue = 100.0;
      var redHue = 0.0;
      var s = "70%";
      var l = "60%";
      var hue = greenHue * sigmoid(value) + redHue * (1.0 - sigmoid(value));
      var colorString = "hsl(" + hue + ", " + s + ", " + l + ")";
      var color = tinycolor(colorString);
      console.log(color.toHex());
      $('#lectureFooter-container').css('background-color', "#" + color.toHex());
      console.log("reer");
    }
  };

  socket.on('student connected', function(scores) {

  });

  // This is an example of how to receive an event in the client
  socket.on('status update', function(data) {
    $('#listeners').html(data.total);
    // HUH.Graph.updateCurrentChartValueFromData(data);
    var score = data;
    HUH.scores.push(data);
    updateUnderstandingFromScore(score);
    console.log("updated!");
  });

  $('.huh-button').click(function() {
    socket.emit('status update');
    if ($(this).hasClass('green-button')) {
      $(this).removeClass('green-button');
      $(this).text('Huh?');
    } else {
      $(this).addClass('green-button');
      $(this).text('Wait, I get it!');
    }
  });
});
