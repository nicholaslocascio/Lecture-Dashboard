var self = this;
self.HUH = self.HUH || {};
var HUH = self.HUH;
HUH.Series = {};
$(function () {

    Highcharts.setOptions({
        global : {
            useUTC : false
        }
    });
    var valueFromScore = function(score) {
      var value = 1.0;
      if (score.total !== 0) {
        value = (1.0 - score.confused / score.total);
      }
      return value;
    };

    HUH.Series.valueFromScore = valueFromScore;
    // Create the chart
    var initSeriesWithPoints = function(scores){
      $('#time-series').highcharts('StockChart', {
        chart : {
            events : {
                load : function () {

                    // set up the updating of the chart each second
                    var series = this.series[0];
                    HUH.series = this.series[0];
                    setInterval(function () {
                        var x = (new Date()).getTime();
                            var scoreValue;
                        if ( HUH.scores[HUH.scores.length - 1] == undefined){
                          scoreValue = 1
                        }else{
                          scoreValue = valueFromScore(HUH.scores[HUH.scores.length - 1]);

                        }

                        series.addPoint([x, scoreValue], true, true);
                    }, 1000);
                }
            }
        },

        rangeSelector: {
            buttons: [{
                count: 1,
                type: 'minute',
                text: '1M'
            }, {
                count: 5,
                type: 'minute',
                text: '5M'
            }, {
                type: 'all',
                text: 'All'
            }],
            inputEnabled: false,
            selected: 0
        },

        title : {
            text : 'Understanding Scores'
        },

        exporting: {
            enabled: false
        },

        series : [{
            name : 'Understanding Scores',
            data : (function () {
                // generate an array of random data
                var data = [], time = (new Date()).getTime(), i;
                var count =  scores.length;
                if(count > 0){
                    time = Date.parse(scores[0].createdAt);
                }
                for (i = -60 ; i < - count; i += 1) {
                    data.push([
                        time + i * 1000,
                         1
                    ]);
                }
                for (i =  - count + 1; i < 0; i += 1) {
                  data.push([
                        Date.parse(scores[count + i-1].createdAt),
                         HUH.Series.valueFromScore(scores[count + i])
                    ]);
                    data.push([
                        Date.parse(scores[count + i].createdAt),
                         HUH.Series.valueFromScore(scores[count + i])
                    ]);

                }
                return data;
            }())
        }]
    });
  }
    HUH.Series.initSeriesWithPoints = initSeriesWithPoints;
    
});
/**
 * Grid-light theme for Highcharts JS
 * @author Torstein Honsi
 */

// Load the fonts
Highcharts.createElement('link', {
   href: 'http://fonts.googleapis.com/css?family=Dosis:400,600',
   rel: 'stylesheet',
   type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);

Highcharts.theme = {
   colors: ["#7cb5ec", "#f7a35c", "#90ee7e", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
      "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
   chart: {
      backgroundColor: null,
      style: {
         fontFamily: "Dosis, sans-serif"
      }
   },
   title: {
      style: {
         fontSize: '16px',
         fontWeight: 'bold',
         textTransform: 'uppercase'
      }
   },
   tooltip: {
      borderWidth: 0,
      backgroundColor: 'rgba(219,219,216,0.8)',
      shadow: false
   },
   legend: {
      itemStyle: {
         fontWeight: 'bold',
         fontSize: '13px'
      }
   },
   xAxis: {
      gridLineWidth: 1,
      labels: {
         style: {
            fontSize: '12px'
         }
      }
   },
   yAxis: {
      minorTickInterval: 'auto',
      title: {
         style: {
            textTransform: 'uppercase'
         }
      },
      labels: {
         style: {
            fontSize: '12px'
         }
      }
   },
   plotOptions: {
      candlestick: {
         lineColor: '#404048'
      }
   },


   // General
   background2: '#F0F0EA'
   
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);