var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var limiter = require("express-rate-limit");
var logger = require("morgan");
var MongoClient = require("mongodb").MongoClient;
var MongoServer = require("mongodb").Server;
var redis = require("redis");
const PORT = 3000;
const REDIS_DB = 7;
var redisClient;
var app;
var redisIsConnected = false;
var mongoIsConnected = false;
//--------------------------------------------------------------------------------------------------
// begin connection
MongoClient.connect("mongodb://localhost:27017/api_v1",function(err,db){
  if(err){
    console.error(err);
    console.error("MongoDB failed to connect");
    exit();
  }else{
    mongoIsConnected = true;
    console.log("MongoDB connected");
    console.log("Connecting to Redis");
    redisClient = redis.createClient();
    redisClient.on("connect",function(){
      redisIsConnected = true;
      console.log("Redis Connected");
      redisClient.select(REDIS_DB,function(err,res){
        if(err){
            console.error("Failed to select Redis DB " + REDIS_DB);
            exit();
        }else{
          console.log("Connected to Redis DB " + REDIS_DB);
          console.log("Mounting API");
          // initialize ExpressJS and mount API
          init(db,redisClient);
        }
      });
    });
    redisClient.on("error",function(){
      console.error("Redis failed to connect");
      exit();
    })
  }
});
//--------------------------------------------------------------------------------------------------
function cleanup(){
  if(mongoIsConnected){
    console.log("Disconnecting from MongoDB");
    mongoClient.close();
  }
  if(redisIsConnected){
    console.log("Disconnecting from Redis");
    redisClient.quit();
  }
  exit();
}
//--------------------------------------------------------------------------------------------------
function exit(){
  console.error("Exiting...");
  process.exit();
}
//--------------------------------------------------------------------------------------------------
function init(m,r){
  app = express();
  // 20 requests per second
  var ipLimiter = limiter({
    windowMs : 1000,
    message : JSON.stringify({
                "this" : "failed", 
                "in" : "servicing your requests", 
                "because" : "rate limit exceeded"
              })
  });

  // handling any unexpected thing
  // process.on("exit",cleanup);
  // process.on("SIGINT",cleanup);
  // process.on("uncaughtException",cleanup);

  // setting up the middlewares
  app.use(logger('dev')); // logging
  // limiting the body size
  app.use(bodyParser.json({
    limit : 512,
    strict : true,
    type : "application/json"
  }));
  app.use(bodyParser.urlencoded({ 
    limit : 512,
    extended: false,
    type : "application/x-www-form-urlencoded"
  }));
  // mounting api v1
  app.use("/api/v1",require("./api/v1/index")(m,r));

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    err.json = {"this" : "failed", "in" : "servicing your request", "because" : "requested resource " + req.url + " could not be found"};
    next(err);
  });

  // error handler
  // production error handler
  app.use(function(err, req, res, next) {
        console.log( err );
        res.status(err.status || 500);
        res.json( err.json );
  });

  // begin listening
  console.log("App listening on port " + PORT);
  app.listen( PORT );
}
//--------------------------------------------------------------------------------------------------
function sizeTooLargeHandler(){

}
//--------------------------------------------------------------------------------------------------