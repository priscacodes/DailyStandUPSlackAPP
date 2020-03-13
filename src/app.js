const createError = require('http-errors');
const express = require('express');
const cron = require('node-cron');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer = require('multer');

const indexRouter = require('./routes/index');
const { sendStandupReminder } = require('./utils/message');

const app = express();
const upload = multer();
app.use(upload.single('avatar'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/', [indexRouter]);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

cron.schedule('10 8 * * *', () => {
  try {
    console.log('---------------------');
    console.log('Running Cron Job');
    sendStandupReminder();
  } catch (e) {
    console.error(e);
  }
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).send(err.message);
  console.log(err);
});

module.exports = app;
