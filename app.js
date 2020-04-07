var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const { check, validationResult } = require('express-validator');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');


var mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology',true);
mongoose.set('useCreateIndex', true);


require('./model/User');
require('./model/Slot');
require('./model/Meeting');
mongoose.connect('mongodb://<user>:<password>@ds145921.mlab.com:45921/bookmyslot');

var home = require('./routes/home');
var auth = require('./routes/authenticate');
var users = require('./routes/users');
var meet = require('./routes/meeting');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({

	secret:'secret',
	saveUninitialized:true,
	resave:true

}));

app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', home);
app.use('/auth', auth);
app.use('/users',users);
app.use('/meet',meet);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
