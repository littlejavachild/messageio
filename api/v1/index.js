var express = require("express");
var router = express.Router();
var _ = require("underscore");

const DEVICES = "devices";
const DB = "api_v1";

// Connections to databases
var redisClient;
var db;

// phrases
const PHRASE_CREATING = "creating the device";
const PHRASE_DELETING = "deleting the device";

// capped collection defaults
const MAX_CAPPED_DOCS = 500; 

//--------------------------------------------------------------------------------------------------
router.get("/",function(req,res){
	res.json({"this" : "succeeded", "in" : "pinging the server"});
});
//--------------------------------------------------------------------------------------------------
router.post("/create",function onCreate(req,res,next){
	// sanity check:
	// check for valid device name
	if(!req.body.name || !isValidDeviceName(req.body.name)){
		return next( get400InvalidDeviceNameError(PHRASE_CREATING) );
	}
	// check for valid description
	// only if description has been supplied
	if(req.body.description){
		if( !isValidDescription(req.body.description) ){
			return next( get400InvalidDescriptionError(PHRASE_CREATING) );
		}
	}
	// check if name is already taken
	// by looking it up in redis
	redisClient.sismember(DEVICES,req.body.name,function onReadFromCache(err,isMember){
		if( isMember ){
			return next( get400NameAlreadyExistsError(req.body.name) );
		}else{
			// add to mongo
			// add to redis
			var device = {
				name : req.body.name,
				createdAt : _.now()
			};
			if(req.body.description){
				device.description = req.body.description;
			}else{
				device.description = "";
			}
			// insert into mongo
			var options = {
				capped : true,
				size : 10000,
				max : MAX_CAPPED_DOCS
			};
			// add device to mongodb
			db.collection(DEVICES).insert(device,function onDeviceInserted(err,device){
				if(err){
					console.log(err);
					return next(get500InternalServerError(PHRASE_CREATING));
				}else{
					// create a capped collection with same name as req.body.name
					db.createCollection(
						req.body.name,
						options,
						function onCreateCollection(err,mongoCollection){
							if(err){
								console.log(err);
								return next(get500InternalServerError(PHRASE_CREATING));
							}else{
								// add to redis
								redisClient.sadd(
									DEVICES,
									req.body.name,
									function onAddToCache(err,isAdded){
										if(err){
											console.log(err);
											return next(get500InternalServerError(PHRASE_CREATING));
										}else{
											res.json( get200DeviceCreated(req.body.name,req.body.description) );
										}
								});
							}
					});
				}
			});
		}
	});
});
//--------------------------------------------------------------------------------------------------
router.delete("/delete/:name",function onDelete(req,res,next){
	// sanity check
	if(!req.params.name || !isValidDeviceName(req.params.name)){
		return next( get400InvalidDeviceNameError(PHRASE_DELETING) );
	}
	// check the cache to see if we have the device
	redisClient.sismember(DEVICES,req.params.name,function onReadFromCache(err,isMember){
		if(err){
			console.log(err);
			return next( get500InternalServerError(PHRASE_DELETING) );
		}else if( !isMember ){
			// if no such name exists, return error
			return next( get400NoSuchDeviceError(PHRASE_DELETING,req.params.name) );
		}else{
			// if such a device exists, remove from cache
			redisClient.srem(DEVICES,req.params.name,function onRemoveFromCache(err,removed){
				if(err){
					console.log(err);
					return next( get500InternalServerError(PHRASE_DELETING) );
				}else{
					// remove the associated collection
					db.dropCollection(req.params.name,function onDropCollection(err,result){
						if(err){
							console.log(err);
							return next( get500InternalServerError(PHRASE_DELETING) );
						}else{
							console.log(result);
							// remove from collection
							db.collection(DEVICES).remove({ name : req.params.name },function onRemoveDevice(err,response){
									if(err){
										console.log(err);
										return next( get500InternalServerError(PHRASE_DELETING) );
									}else{
										// finally, send a response
										res.json( get204DeviceSuccessfullyDeleted(req.params.name) );
									}
							});
						}
					});
				}
			});
		}
	});
});
//--------------------------------------------------------------------------------------------------
module.exports = function(m,r){
	if(!r){
		console.error("No Redis client supplied. API v1 will not respond to any requests.");
		return function(req,res,next){ next(); };
	}
	if(!m){
		console.error("No MongoDB client supplied. API v1 will not respond to any requests.");
		return function(req,res,next){ next(); };
	}
	redisClient = r;
	db = m;
	console.log("API v1 Mounted");
	return router;
};
//--------------------------------------------------------------------------------------------------
function get500InternalServerError(_in){
	var reply = {
		"error" : "InternalServerError",
		"this" : "failed",
		"in" : _in,
		"because" : "of an internal server error"
	};
	var err = new Error("InternalServerError");
	err.status = 500;
	err.json = reply;
	return err;
}
//--------------------------------------------------------------------------------------------------
function get400InvalidDeviceNameError(_in){
	var reply = {
		"error" : "InvalidNameError",
		"this" : "failed",
		"in" : _in,
		"because" : "no valid name was supplied"
	};
	var err = new Error("InvalidNameError");
	err.status = 400;
	err.json = reply;
	return err;
}
//--------------------------------------------------------------------------------------------------
function get400NameAlreadyExistsError(name){
	var reply = {
		"error" : "NameAlreadyExistsError",
		"this" : "failed",
		"in" : "creating the device",
		"because" : "the name " + name + " has already been taken"
	};
	var err = new Error("NameAlreadyExistsError");
	err.status = 400;
	err.json = reply;
	return err;
}
//--------------------------------------------------------------------------------------------------
function get400InvalidDescriptionError(_in){
	var reply = {
		"error" : "InvalidDescriptionError",
		"this" : "failed",
		"in" : _in,
		"because" : "the description is invalid"
	}
	var err = new Error("InvalidDescriptionError");
	err.status = 400;
	err.json = reply;
	return err;
}
//--------------------------------------------------------------------------------------------------
function get200DeviceCreated(name,description){
	var reply = {
		"this" : "succeeded",
		"in" : "creating the device",
		"with" : {
			"name" : name
		}
	}
	if(description){
		reply.with.description = description;
	}
	return reply;
}
//--------------------------------------------------------------------------------------------------
function isValidDeviceName(name){
	var allHyphensRegex = /^-*$/;
	var allDigitsRegex = /^\d*$/;
	var validNameRegex = /^[\d\w-]{4,64}$/;
	var hasSpaceRegex = /\s/;
	// name cannot be all digits
	if(allDigitsRegex.test(name)) return false;
	// name cannot be all hyphens
	if(allHyphensRegex.test(name)) return false;
	// invalid name length
	if(name.length < 4 || name.length > 64) return false;
	// name cannot start or end with hyphen
	if(name.charAt(0) === "-" || name.charAt( name.length -1 ) === "-") return false;
	// name cannot contain space
	if(hasSpaceRegex.test(name)) return false;
	// valid name regex
	if(validNameRegex.test(name)) return true;
	return false;
}
//--------------------------------------------------------------------------------------------------
function isValidDescription(description){
	if(description.length < 10 || description.length > 140) return false;
	return true;
}
//--------------------------------------------------------------------------------------------------
function get400NoSuchDeviceError(_in,name){
	var reply = {
		"error" : "NoSuchDeviceError",
		"this" : "failed",
		"in" : _in,
		"because" : "there is no device with name " + name
	}
	var err = new Error("NoSuchDeviceError");
	err.status = 400;
	err.json = reply;
	return err;
}
//--------------------------------------------------------------------------------------------------
function get204DeviceSuccessfullyDeleted(name){
	var reply = {
		"this" : "succeeded",
		"in" : "deleting the device",
		"with" : {
			"name" : name
		}
	}
	return reply;
}
//--------------------------------------------------------------------------------------------------
function unhyphenate(name){
	return name.replace(/-/g,"_");
}
//--------------------------------------------------------------------------------------------------