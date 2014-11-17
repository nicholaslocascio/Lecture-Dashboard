(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['footer'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<p>huh? by Kulpreet Chilana, Eduardo De Leon, Nick Locascio, Matt Susskind</p>\n";
  },"useData":true});
templates['header'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<h1 class=\"logo-white\">huh?</h1>\n<h4>realtime lecture dashboard.</h4>";
  },"useData":true});
templates['lectureDetails'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"panel-heading\">\n	<h4>Lecture Details</h4>\n</div>\n<div class=\"panel-body\">\n	<p><strong>Class:</strong> 6.0dwdw46</p>\n	<p><strong>Topic:</strong> Bellman-Ford</p>\n	<p><strong>Lecturer:</strong> John Smith</p>\n</div> ";
  },"useData":true});
templates['lectureFooter'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"panel-body\"></div>\n<div class=\"panel-footer\">Welcome, John Smith.\n	<span class=\"right\"><a href=\"/\">End Lecture</a></span>\n</div>";
  },"useData":true});
templates['lectureGraph'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return " <div class=\"embed-responsive embed-responsive-16by9\" id=\"player\">\n  	<canvas id=\"graph\"></canvas>\n</div>";
  },"useData":true});
templates['sessionLinks'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<p>Give this link to your audience members to get live feedback:</p>\n<div id=\"link\" class=\"input-group input-group-sm\">\n	<span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-link\"></span></span>\n	<input type=\"text\" id=\"link-text\" class=\"form-control\" placeholder=\"Link\" readonly>\n</div>";
  },"useData":true});
})();
