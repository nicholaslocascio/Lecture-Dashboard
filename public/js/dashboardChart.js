var self = this;
self.HUH = self.HUH || {};
var HUH = self.HUH;
HUH.Graph = {};

$(function() {
  var numSteps = 60 * 60;
  var updateDt = 500;

  var createGradient = function(data, lightness, saturation, width) {
    if (!window.myLine) {
      return "green";
    }
    var greenHue = 100.0;
    var redHue = 0.0;
    var s = saturation;
    var l = lightness;
    var numPoints = data.length;
    var dx = 0.0;
    if (numPoints !== 0) {
      dx = 1.0 / numPoints;
    }
    var currentX = dx;
    var gradient = ctx.createLinearGradient(0, 0, numPoints * window.myLine.chart.width / numSteps, 0);

    for (var i in data) {
      var point = data[i];
      var value = point.value;
      var hue = greenHue * sigmoid(value) + redHue * (1.0 - sigmoid(value));
      var colorString = "hsl(" + hue + ", " + s + ", " + l + ")";
      var color = tinycolor(colorString);
      gradient.addColorStop(currentX, color);
      currentX += dx;
      currentX = Math.min(currentX, 1.0);
    }

    return gradient;
  };
  //

  var graphValueFromScore = function(score) {
    var value = 1.0;
    if (score.total !== 0) {
      value = (1.0 - score.confused / score.total);
    }
    return value;
  };
  HUH.graphValueFromScore = graphValueFromScore;
  var randomScalingFactor = function() {
    return Math.random() * 1;
  };
  var understandsArray = [1.0, 1.0];
  var scoreArray = [{
    confused: 0,
    total: 0,
  }, {
    confused: 0,
    total: 0,
  }];
  var understandsTimeSeries = [{
    value: 1.0,
    time: new Date()
  }, {
    value: 1.0,
    time: new Date()
  }];

  var idealLabels = ["", ""];
  for (var i = 0; i < numSteps; i++) {
    idealLabels.push("");
  }
  var labelsArray = idealLabels;

  var addPointToChart = function(value) {
    var chart = window.myLine;
    var newTimeSeriesDataPoint = {
      value: value,
      time: new Date()
    };
    understandsTimeSeries.push(newTimeSeriesDataPoint);
    var index = understandsTimeSeries.length - 1;
    var lastPoint = chart.datasets[0].points[index - 1];
    var copiedPoint = jQuery.extend(true, {}, lastPoint);
    copiedPoint.value = newTimeSeriesDataPoint.value;
    chart.datasets[0].points.push(copiedPoint);

    chart.update();
  };

  HUH.Graph.addPointToChart = addPointToChart;

  var lineChartData = {
    labels: labelsArray,
    datasets: [{
      label: "My First dataset",
      fillColor: "rgba(20,180,20,0.2)",
      strokeColor: "rgba(20,240,0,1)",
      pointColor: "rgba(20,240,0,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(220,220,220,1)",
      data: understandsArray
    }]
  };

  var ctx = document.getElementById("graph").getContext("2d");
  var lineChart = new Chart(ctx).Line(lineChartData, {
    responsive: true,
    scaleOverride: true,
    scaleSteps: 4,
    scaleStepWidth: 0.25,
    scaleStartValue: 0,
    pointDot: false,
    scaleOverlay: false,
    // animationSteps: 1,
    // animationEasing: "linear",
    animation: false,
    bezierCurve: true,
    scaleShowGridLines: false,
    datasetStrokeWidth: 4,
    showTooltips: false,
  });
  window.myLine = lineChart;

  var mostRecentValue = 1.0;

  HUH.Graph.updateCurrentChartValueFromData = function(data) {
    var value = graphValueFromScore(data);
    mostRecentValue = value;
    updateGradient();
  };

  var addScoreToChart = function() {
    var lastValue = understandsTimeSeries[understandsTimeSeries.length - 1].value;
    var newValue = 0;
    newValue = mostRecentValue;
    addPointToChart(newValue);
  };

  HUH.Graph.addScoreToChart = addScoreToChart;

  var updateGradient = function() {
    var points = window.myLine.datasets[0].points;

    var gradientWidth = 1.0;
    if (!gradientWidth) {
      gradientWidth = 0.0;
    }

    window.myLine.datasets[0].fillColor = createGradient(points, "85%", "70%", gradientWidth);
    window.myLine.datasets[0].strokeColor = createGradient(points, "60%", "70%", gradientWidth);
  };

  setInterval(function() {
    updateGradient();
    addScoreToChart();
  }, updateDt);


  var sigmoid = function(x) {
    return (1.0 / (1.0 + Math.exp(-(10 * (x - 0.5)))));
  };

});
