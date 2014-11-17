$(function() {

  Chart.types.Line.extend({

    name: "LineAlt",
    initialize: function(data) {
      Chart.types.Line.prototype.initialize.apply(this, arguments);
    },
    draw: function(ease) {
      var easingDecimal = ease || 1;
      this.clear();

      var ctx = this.chart.ctx;

      // Some helper methods for getting the next/prev points
      var hasValue = function(item) {
          return item.value !== null;
        },
        nextPoint = function(point, collection, index) {
          return Chart.helpers.findNextWhere(collection, hasValue, index) || point;
        },
        previousPoint = function(point, collection, index) {
          return Chart.helpers.findPreviousWhere(collection, hasValue, index) || point;
        };

      this.scale.draw(easingDecimal);


      Chart.helpers.each(this.datasets, function(dataset) {
        var pointsWithValues = Chart.helpers.where(dataset.points, hasValue);

        //Transition each point first so that the line and point drawing isn't out of sync
        //We can use this extra loop to calculate the control points of this dataset also in this loop

        Chart.helpers.each(dataset.points, function(point, index) {
          if (point.hasValue()) {
            point.transition({
              y: this.scale.calculateY(point.value),
              x: this.scale.calculateX(index)
            }, easingDecimal);
          }
        }, this);


        // Control points need to be calculated in a seperate loop, because we need to know the current x/y of the point
        // This would cause issues when there is no animation, because the y of the next point would be 0, so beziers would be skewed
        if (this.options.bezierCurve) {
          Chart.helpers.each(pointsWithValues, function(point, index) {
            var tension = (index > 0 && index < pointsWithValues.length - 1) ? this.options.bezierCurveTension : 0;
            point.controlPoints = Chart.helpers.splineCurve(
              previousPoint(point, pointsWithValues, index),
              point,
              nextPoint(point, pointsWithValues, index),
              tension
            );

            // Prevent the bezier going outside of the bounds of the graph

            // Cap puter bezier handles to the upper/lower scale bounds
            if (point.controlPoints.outer.y > this.scale.endPoint) {
              point.controlPoints.outer.y = this.scale.endPoint;
            } else if (point.controlPoints.outer.y < this.scale.startPoint) {
              point.controlPoints.outer.y = this.scale.startPoint;
            }

            // Cap inner bezier handles to the upper/lower scale bounds
            if (point.controlPoints.inner.y > this.scale.endPoint) {
              point.controlPoints.inner.y = this.scale.endPoint;
            } else if (point.controlPoints.inner.y < this.scale.startPoint) {
              point.controlPoints.inner.y = this.scale.startPoint;
            }
          }, this);
        }


        //Draw the line between all the points
        ctx.lineWidth = this.options.datasetStrokeWidth;
        ctx.strokeStyle = dataset.strokeColor;

        Chart.helpers.each(pointsWithValues, function(point, index) {
          var previous = previousPoint(point, pointsWithValues, index);
          var next = nextPoint(point, pointsWithValues, index);
          ctx.beginPath();
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.strokeStyle = next.strokeColor;

            if (this.options.bezierCurve) {
              ctx.bezierCurveTo(
                previous.controlPoints.outer.x,
                previous.controlPoints.outer.y,
                point.controlPoints.inner.x,
                point.controlPoints.inner.y,
                point.x,
                point.y
              );
            } else {
              ctx.lineTo(point.x, point.y);
              if (index !== 1) {
                ctx.lineTo(next.x, next.y);
              }
            }
          }
          ctx.stroke();
          if (this.options.datasetFill && pointsWithValues.length > 0) {
            //Round off the line by going to the base of the chart, back to the start, then fill.
            ctx.lineTo(next.x, this.scale.endPoint);
            ctx.lineTo(point.x, this.scale.endPoint);
            ctx.fillStyle = next.fillColor;
            ctx.fill();
          }
          ctx.closePath();
          ctx.moveTo(point.x, point.y);


        }, this);



        //Now draw the points over the line
        //A little inefficient double looping, but better than the line
        //lagging behind the point positions
        Chart.helpers.each(pointsWithValues, function(point) {
          point.draw();
        });
      }, this);
    }

  });
  //

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
  for (var i = 0; i < 120; i++) {
    idealLabels.push("");
  }
  var labelsArray = idealLabels;

  var updateLabelsArray = function() {
    if (understandsTimeSeries.length < idealLabels.length) {
      return;
    }
  };

  var updateChart = function(chart, value) {
    var newTimeSeriesDataPoint = {
      value: value,
      time: new Date()
    };
    var sigmoid = function(x) {
      return (1.0 / (1.0 + Math.exp(-(10 * (x - 0.5)))));
    };
    understandsTimeSeries.push(newTimeSeriesDataPoint);
    var index = understandsTimeSeries.length - 1;
    var lastPoint = chart.datasets[0].points[index - 1];
    var copiedPoint = jQuery.extend(true, {}, lastPoint);
    copiedPoint.value = newTimeSeriesDataPoint.value;

    var greenHue = 90.0;
    var redHue = 0.1;
    var weight = newTimeSeriesDataPoint.value;
    var hue = greenHue * sigmoid(weight) + redHue * (1.0 - sigmoid(weight));
    var s = 70;
    var l = 50;
    var colorString = "hsl(" + hue + ", " + s + ", " + l + ")";
    var fillColor = tinycolor(colorString);

    var oldWeight = lastPoint.value;
    var oldHue = greenHue * sigmoid(oldWeight) + redHue * (1.0 - sigmoid(oldWeight));
    var oldColorString = "hsl(" + oldHue + ", " + s + ", " + l + ")";
    var oldFillColor = tinycolor(oldColorString);

    var gradient = ctx.createLinearGradient(0, 0, 100, 0);
    gradient.addColorStop(0, oldFillColor);
    gradient.addColorStop(1, fillColor);

    copiedPoint.strokeColor = fillColor.toHexString();
    copiedPoint.fillColor = gradient;
    copiedPoint.highlightFill = fillColor.toHexString();
    copiedPoint.highlightStroke = fillColor.toHexString();
    chart.datasets[0].points.push(copiedPoint);

    chart.update();
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
  var lineChart = new Chart(ctx).LineAlt(lineChartData, {
    responsive: true,
    scaleOverride: true,
    scaleSteps: 4,
    scaleStepWidth: 0.25,
    scaleStartValue: 0,
    pointDot: false,
    scaleOverlay: false,
    animationSteps: 1,
    animationEasing: "linear",
    bezierCurve: false,
  });
  window.myLine = lineChart;

  setInterval(function() {
    var lastValue = understandsTimeSeries[understandsTimeSeries.length - 1].value;
    var newValue = lastValue + ((randomScalingFactor() - 0.5) / 2.0);
    newValue = Math.max(Math.min(newValue, 1.0), 0.0);
    if (randomScalingFactor() < 0.1) {
      newValue = lastValue;
    }
    updateChart(lineChart, newValue);

  }, 1000);

});
