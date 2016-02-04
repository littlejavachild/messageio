var valid = require("../utils/valid");
var m = require("../utils/messages");
var _ = require("underscore");
var bcrypt = require("bcrypt");

var db; // MongoClient database connection
var DB; // Database name
var DEVICS; // Devices collection name
const PHRASE_CREATING = "creating the device";
const MAX_CAPPED_DOCS = 500;
//--------------------------------------------------------------------------------------------------
function onCreate(req,res,next){
	// sanity check:
	// check for valid device name
	if(!req.body.name || !valid.isValidDeviceName(req.body.name)){
		return next( m.get400InvalidDeviceNameError(PHRASE_CREATING) );
	}
	// check for valid description
	// only if description has been supplied
	if(req.body.description){
		if( !valid.isValidDescription(req.body.description) ){
			return next( m.get400InvalidDescriptionError(PHRASE_CREATING) );
		}
	}
	// check for a valid key
	// only if it has been supplied
	if(req.body.key){
		if(!valid.isValidKey(req.body.key)){
			return next( m.get400InvalidKeyError(PHRASE_CREATING) );
		}
	}
	// check if name is already taken
	// by looking it up in mongo
	db.collection(DEVICES).findOne({name:req.body.name},function onFind(err,doc){
		if(err){
			return next( m.get500InternalServerError(PHRASE_CREATING) );
		}
		// device already taken?
		// return an error
		if(doc){
			return next( m.get400NameAlreadyExistsError(PHRASE_CREATING,req.body.name) );
		}
		// not taken?
		// create a device object
		var device = {
			name : req.body.name,
			createdAt : _.now()
		};
		// add the optional description
		device.description = req.body.description ? req.body.description : "";
		device.key = req.body.key ? bcrypt.hashSync(req.body.key,8) : undefined;
		// create a capped collection object
		var options = {
			capped : true,
			size : 10000,
			max : MAX_CAPPED_DOCS
		};
		// add device to Mongo
		db.collection(DEVICES).insert(device,function onDeviceInserted(err,device){
			if(err){
				return next( m.get500InternalServerError(PHRASE_CREATING) );
			}
			// create a capped collection in Mongo
			db.createCollection(req.body.name,options,function onCreateCollection(err,coll){
				if(err){
					return next( m.get500InternalServerError(PHRASE_CREATING) );
				}
				res.json( m.get200DeviceCreated(req.body.name,req.body.description) );
			});
		});
	});
}
//--------------------------------------------------------------------------------------------------
function init(m,dbName,collName){
	db = m;
	DB = dbName;
	DEVICES = collName;
}
//--------------------------------------------------------------------------------------------------
module.exports = {
	init : init,
	onCreate : onCreate
};