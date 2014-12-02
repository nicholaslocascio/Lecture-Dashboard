var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var mongoose = require('mongoose');

var connection_string = 'mongodb://localhost:27017/ld';

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
  connection_string = 'mongodb://' + process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/ld';
} else if (process.env.MONGOHQ_URL) {
  connection_string = process.env.MONGOHQ_URL;
}

mongoose.connect(connection_string);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongoose Connection Error:'));

var lecture = require('./data/lecture');

var routes = require('./routes/index');
var api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: '4m6s#3@vm)if2o85#e+lr^do5oem#ct(@!(bem_d1y!gks_8^#'
}));

app.use('/', routes);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT;
var ip = process.env.OPENSHIFT_NODEJS_IP || process.env.IP;

var debug = require('debug')('ld');

app.set('port', port || 3000);

var server = app.listen(app.get('port'), ip, function() {
  debug('Express server listening on port ' + server.address().port);
});

var io = require('socket.io').listen(server);
require('./routes/sockets')(io);

module.exports = app;
