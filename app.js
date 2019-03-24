'use strict';

// load modules
const express = require('express');
const mongoose = require('mongoose');
const routes = require("./routes");

const morgan = require('morgan');
const jsonParser = require("body-parser");

mongoose.connect("mongodb://localhost:27017/fsjstd-restapi");

const db = mongoose.connection;

db.on("error",function(err){
  console.log("Connection error: ", err);
});

db.once("open",function(){
  console.log("Connection Successful");
});

// create the Express app
const app = express();

app.use(jsonParser());
app.use(morgan('dev'));

// TODO setup your api routes here

// uses routes to handle everything other than errors
app.use('/api', routes);

app.use((req,res,next)=>{
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// setup a global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
    }
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
