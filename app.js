var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let moviesRouter = require('./routes/movies')

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { db } = require('./config/database');
const {config } = require('./config/Config');
var app = express();

mongoose.connect(db ,  {
  useNewUrlParser: true,
  // userUnifiedTopology: true,
}).then(() => console.log('MongoDB connected!')
).catch(err => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const verifyUserToken = (req, res, next) => { //middleware
  let token = req.headers.authorization;
  console.log('Token ', token);
  if(!token) return res.status(401).send("Access Denied / Unauthorized request");

  try{
    token = token.split(' ')[1]; // Remove Bearer from string
    console.log('token' ,token);
    if(token === 'null' || !token) return res.status(481).send('Unthorization Request');
   
    let verifiedUser = jwt.verify(token, config.TOKEN_SECRET);
    if(!verifiedUser) return res.status(401).send('Unautorized request');
  
    req.user = verifiedUser; // user_id
    next();

  }catch (error){
    console.log(error);
    res.status(400).send("Invalid Token");
  }
}


app.use('/', indexRouter);
app.use('/auth', usersRouter);
app.use('/movies', verifyUserToken ,moviesRouter);



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
