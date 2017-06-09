var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var routes = require('./routing');

// view engine setup
var cons = require('consolidate');
app.engine('html', cons.swig);
app.set('views', 'public');
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'content')));
app.use(express.static(path.join(__dirname, '/')));

app.use(express.static(path.join(__dirname, 'factory')));
app.use(express.static(path.join(__dirname, 'service')));
app.use(express.static(path.join(__dirname, 'directive')));

app.use('/', routes);
app.use('/login', routes);
app.use('/register', routes);
app.use('/forgot', routes);
app.use('/logout', routes);
app.use('/password/reset/:token', routes);
app.use('/reset/password', routes); // route for direct hit no routing of angular going for mail.js

var apiUserMethodJsInclude = require('./modules/api/apiUserMethod');
routes.post('/api/login', apiUserMethodJsInclude.login);
routes.post('/api/create', apiUserMethodJsInclude.create);
routes.post('/api/fetchUserByEmail', apiUserMethodJsInclude.fetchUserByEmail);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;