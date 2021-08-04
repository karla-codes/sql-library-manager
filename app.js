var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');

var app = express();

const { sequelize } = require('./models/index');

// syncs model with databse
(async () => {
  try {
    await sequelize.sync();
    console.log('Connection has been established successfully');
  } catch (err) {
    console.error('Unable to connect to database:', err);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = createError(404, "Uh oh! Looks like this page doesn't exist.");
  console.log(`Error: ${err.statusCode}`, err.message);
  res.render('page-not-found');
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  err.status === 404
    ? res.status(404).render('page-not-found')
    : res.status(err.status || 500).render('error');

  console.log(`Error: ${res.statusCode}`, err.message);
});

module.exports = app;
