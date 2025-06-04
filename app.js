var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var RegisterRouter = require('./routes/register');
var mysql = require("mysql");
var app = express();
require('colors');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



function checkDomain(req, res, next) {
  const allowedDomains = ['http://localhost:5173']
  const origin = req.get('origin');
  if (allowedDomains.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    next();
  } else {
    console.log("ตรวจพบการเข้าถึงที่ไม่ได้รับอนุญาต".red + origin);
    res.status(403).json({ message: 'Access denied for this domain' });
  }
}

app.use(checkDomain);

// เชื่อมต่อ middleware checkDomain
app.use(checkDomain);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', RegisterRouter);
app.use('/login', require('./routes/login'));
app.use('/product', require('./routes/product'));
app.use('/category', require('./routes/category'));
app.use('/finace', require('./routes/Finance'));
app.use('/userlist', require('./routes/userlist'));
app.use('/history', require('./routes/history'));
app.use('/config', require('./routes/configweb'));



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

// เชื่อมต่อฐานข้อมูล
global.connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "demoWebsite",
});
connection.connect((err) => {
  if (err) {
    console.error("[MYSQL] Error connecting to database: ".red + err.stack);
    return;
  }
  console.log("[MYSQL] Connected to database".green);
});

module.exports = app;
