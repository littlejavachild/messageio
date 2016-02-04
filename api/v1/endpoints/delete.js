var valid = require("../utils/valid");
var m = require("../utils/messages");
var _ = require("underscore");
var bcrypt = require("bcrypt");

var db; // MongoClient database connection
var DB; // Database name
var DEVICS; // Devices collection name
const PHRASE_DELETING = "deleting the device";

function onDelete(req,res,next){
	// sanity check
	if(!req.params.name || !valid.isValidDeviceName(req.params.name)){
		return next( m.get400InvalidDeviceNameError(PHRASE_DELETING) );
	}
	// check if we have the device
	db.collection(DEVICES).findOne({name:req.params.name},function onFind(err,doc){
		if(err){
			return next( m.get500InternalServerError(PHRASE_DELETING) );
		}
		// check if there is no such device
		if(!doc){
			return next( m.get400NoSuchDeviceError(PHRASE_DELETING,req.params.name) );
		}
		// If the device is locked, 
		// check if a valid key has been supplied
		if(doc.key){
			// If no key has been supplied, 
			// return an error
			if(!req.body.key){
				return next( m.get400DeviceLockedError(PHRASE_DELETING,req.params.name) );
			}
			// If a key has been supplied,
			// check if the key is valid
			var isValidKey = bcrypt.compareSync(req.body.key,doc.key);
			if(!isValidKey){
				return next( m.get400DeviceLockedError(PHRASE_DELETING,req.params.name) );
			}
		}
		// If the device is not locked, proceed to delete
		// Delete the device
		db.collection(DEVICES).remove({name:req.params.name},function onDeleteDevice(err,response){
			if(err){
				return next( m.get500InternalServerError(PHRASE_DELETING) );
			}
			// Drop the associated collection
			db.dropCollection(req.params.name,function onDropCollection(err,response){
				if(err){
					return next( m.get500InternalServerError(PHRASE_DELETING) );
				}
				// finally, send a response
				return res.json( m.get204DeviceSuccessfullyDeleted(req.params.name) );
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
	onDelete : onDelete
};