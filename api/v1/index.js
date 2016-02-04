var express = require("express");
var router = express.Router();

// Name of database
const DEVICES = "devices";
const DB = "api_v1";
// Connections to databases
var db;

// phrases
const PHRASE_SETTING_KEY = "setting the key"; 

var ping = require("./endpoints/ping");
var create = require("./endpoints/create");
var del = require("./endpoints/delete");
var lock = require("./endpoints/lock");
var valid = require("./utils/valid");

//--------------------------------------------------------------------------------------------------
router.get("/",ping);
//--------------------------------------------------------------------------------------------------
router.post("/create",create.onCreate);
//--------------------------------------------------------------------------------------------------
router.delete("/delete/:name",del.onDelete);
//--------------------------------------------------------------------------------------------------
router.put("/lock/:name",lock.onLock);
//--------------------------------------------------------------------------------------------------
router.put("/unlock/:name",lock.onUnlock);
//--------------------------------------------------------------------------------------------------
module.exports = function(m){
	if(!m){
		console.error("No MongoDB client supplied. API v1 will not respond to any requests.");
		return function(req,res,next){ next(); };
	}
	db = m;
	// init the creation engine
	create.init(m,DB,DEVICES);
	// init deletion engine
	del.init(m,DB,DEVICES);
	// init the locking engine
	lock.init(m,DB,DEVICES);
	console.log("API v1 Mounted");
	return router;
};
//--------------------------------------------------------------------------------------------------