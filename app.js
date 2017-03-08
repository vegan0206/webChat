global.rootPath = __dirname;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var compression = require('compression'); //- 开启gizp
var routes = require(rootPath + '/routes/routerEntry');

var app = express();

//配置session
app.use(session({
  secret: "webChat",
  name: "isessionid",   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
  cookie: { path:"/",httpOnly:true,maxAge: 1000*60*60*24*2 },  //2天后session和相应的cookie失效过期
  resave: false,
  saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views',"render"));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public',"favicon", 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public',"build")));
app.use(compression());

// 加载所有路由
routes(app);

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
