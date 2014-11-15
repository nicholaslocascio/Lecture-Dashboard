$(function() {

  //Chart.js Sample. Can replace this with whatever you want later.
  var randomScalingFactor = function() {
    return Math.random() * 1;
  };
  var understandsArray = [1.0, 1.0];
  var understandsTimeSeries = [{
    value: 1.0,
    time: new Date()
  }, {
    value: 1.0,
    time: new Date()
  }];

  var idealLabels = ["11:00AM", ""];
  var labelsArray = idealLabels;

  var updateLabelsArray = function() {
    if (understandsTimeSeries.length < idealLabels.length) {
      return;
    }
  };

  var updateChart = function(chart) {
    var lastValue = understandsTimeSeries[understandsTimeSeries.length - 1].value;
    var newValue = lastValue + ((randomScalingFactor() - 0.5) / 2.0);
    newValue = Math.max(Math.min(newValue, 1.0), 0.0);
    if (randomScalingFactor() > 0.75) {
      newValue = lastValue;
    }
    var newTimeSeriesDataPoint = {
      value: newValue,
      time: new Date()
    };
    understandsTimeSeries.push(newTimeSeriesDataPoint);
    chart.addData([newTimeSeriesDataPoint.value], "");
    updateLabelsArray();
  };

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
    scaleStartValue: 0
  });
  window.myLine = lineChart;

  setInterval(function() {
    updateChart(lineChart);
    console.log('woo');
    console.log(understandsArray);

  }, 1000);

});
