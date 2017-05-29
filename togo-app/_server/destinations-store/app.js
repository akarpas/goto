/*jshint esversion: 6*/

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth-routes');
const queryRoutes = require('./routes/query-routes');
const session    = require('express-session');
const passport   = require('passport');
const gotoApi = require('./routes/goto-api');
const cors = require('cors');

require('./configs/database');

var app = express();
var corsOptions = {credentials: true, origin: 'http://localhost:4200'};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.options('*',cors(corsOptions));
app.use(cors(corsOptions));

app.use(passport.initialize());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/goto-database');

// app.use(session({
//   secret: 'angular auth passport secret shh',
//   resave: true,
//   saveUninitialized: true,
//   cookie : { httpOnly: true, maxAge: 2419200000 }
// }));

// const passportConfig = require('./configs/passport');
// passportConfig(passport);


app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRoutes);
app.use('/api', gotoApi);
app.use('/query', queryRoutes);

app.use((req, res, next) => {
  res.sendfile(__dirname + '/public/index.html');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
