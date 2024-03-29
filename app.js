const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Create secret key for JWT
require('./config/generateSecretKey');

// Gives access to the environmental variable
require('dotenv').config();

// Connect to the database
require('./config/database');

const indexRouter = require('./routes/index');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/posts', postRouter);
app.use('/users', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  err.stack = req.app.get('env') === 'development' ? err.stack : undefined;

  if (err.status === 404) {
    return res.status(404).json({ message: '404 page not found' });
  }
  // Send error
  if (err.stack !== undefined) {
    res
      .status(err.status || 500)
      .json({ error: err.message, stack: err.stack });
  } else {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = app;
