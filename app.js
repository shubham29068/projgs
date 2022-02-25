const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const authRouter= require('./routes/auth')
const userRouter = require('./routes/user')
// cross origin resource sharing security applied to an api
const cors = require('cors');
 
//mongo connect
global.ObjectId = require('mongoose').Types.ObjectId;
global.mongoose = require('mongoose');
require('./db/config').configure(mongoose);

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use((req,res,next)=>{
    // cross origin resource sharing security applied to an api in  this
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/',authRouter)
app.use('/user', userRouter)

module.exports = app;
