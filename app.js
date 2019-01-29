const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const bodyParser = require('body-parser');

const app = express();


// Necessary Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost:27017/app', {useNewUrlParser: true}, (err) => {
  if (err) throw err;
  console.log('Connected to database!!');
});

require('./model/Post');
require('./model/Comment');
require('./model/User');

// Import passport 
require('./modules/passport')(passport);

const PostBlog = mongoose.model('PostBlog');
const CommentPost = mongoose.model('CommentPost');

PostBlog.find({}, (err, users) => {
  if (err) throw err;
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
// Serving Static Files

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// Applying Passport Middleware
app.use(passport.initialize());
app.use(passport.session());



app.use('/', require('./routes/index'));
app.use('/posts', require('./routes/posts'));

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
