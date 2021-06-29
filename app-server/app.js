/* Variables */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const Redis = require('ioredis');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const logger = require('morgan');

const app = express();
const redis = new Redis(require('./redis.config'));

/* View engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/* Global middleware setup */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(require('./cors.config')));
app.use(csrf(require('./csrf.config')));
app.use(express.static(path.join(__dirname, 'public')));

/* Express local variables within the app */
app.locals.redis = redis;

/* Routes */
app.use('/', require('./routes/index'));
app.use('/index', require('./routes/index'));
app.use('/gameplay', require('./routes/gameplay'));
app.use('/newcode', require('./routes/newcode'));
app.use('/verify-gamecode', require('./routes/verify-gamecode'));

/* Catch 404 and forward to error handler */
app.use((req, res, next) => {
  next(createError(404));
});

/* Error handler */
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = { app };
