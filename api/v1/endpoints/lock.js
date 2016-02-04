var valid = require("../utils/valid");
var m = require("../utils/messages");
var _ = require("underscore");
var bcrypt = require("bcrypt");

var db; // MongoClient database connection
var DB; // Database name
var DEVICS; // Devices collection name

const PHRASE_LOCKING = "locking the device";
const PHRASE_UNLOCKING = "unlocking the device";
//--------------------------------------------------------------------------------------------------
function onLock(req,res,next){
	// sanity check
	// check if a valid name has been supplied
	if(!req.params.name || !valid.isValidDeviceName(req.params.name)){
		return next( m.get400InvalidDeviceNameError(PHRASE_LOCKING) );
	}
	// check if we have a key
	if(!req.body.key || !valid.isValidKey(req.body.key)){
		return next( m.get400InvalidKeyError(PHRASE_LOCKING) );
	}
	// check if we have the device
	db.collection(DEVICES).findOne({name:req.params.name},function onFind(err,doc){
		if( err ){
			return next( m.get500InternalServerError(PHRASE_LOCKING) );
		}
		// check if there is no such device
		if(!doc){
			return next( m.get400NoSuchDeviceError(PHRASE_LOCKING,req.params.name) );
		}
		// we have the device
		// check if it is locked
		// locked devices cannot be locked again
		if(doc.key){
			return next( m.get400DeviceLockedError(PHRASE_LOCKING,req.params.name) );
		}
		// if not locked, lock it
		doc.key = bcrypt.hashSync(req.body.key,8);
		db.collection(DEVICES).save(doc,function onSave(err,doc){
			if(err){
				return next( m.get500InternalServerError(PHRASE_LOCKING) );
			}
			res.json( m.get200DeviceLocked(PHRASE_LOCKING,req.params.name) );
		});
	});	

}
//--------------------------------------------------------------------------------------------------
function onUnlock(req,res,next){
	// sanity check
	// check if a valid name has been supplied
	if(!req.params.name || !valid.isValidDeviceName(req.params.name)){
		return next( m.get400InvalidDeviceNameError(PHRASE_UNLOCKING) );
	}
	// check if we have a key
	if(!req.body.key || !valid.isValidKey(req.body.key)){
		return next( m.get400InvalidKeyError(PHRASE_UNLOCKING) );
	}
	// check if we have the device
	db.collection(DEVICES).findOne({name:req.params.name},function onFind(err,doc){
		if( err ){
			return next( m.get500InternalServerError(PHRASE_UNLOCKING) );
		}
		// check if there is no such device
		if(!doc){
			return next( m.get400NoSuchDeviceError(PHRASE_UNLOCKING,req.params.name) );
		}
		// if the device is unlocked already,
		// return success
		if(!doc.key){
			return res.json( m.get200DeviceUnlocked(PHRASE_UNLOCKING,req.params.name) );
		}
		if(doc.key){
			// if the device has a key,
			// check the key
			var isValidKey = bcrypt.compareSync(req.body.key,doc.key);
			if(!isValidKey){
				return next( m.get400InvalidKeyError(PHRASE_UNLOCKING) );
			}
			// remove the key
			doc.key = undefined;
			// save the device
			db.collection(DEVICES).save(doc,function onSave(err,doc){
				if(err){
					return next( m.get500InternalServerError(PHRASE_UNLOCKING) )
				}
				// respond
				res.json( m.get200DeviceUnlocked(PHRASE_UNLOCKING,req.params.name) );
			});
		}
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
	onLock : onLock,
	onUnlock : onUnlock
};
//--------------------------------------------------------------------------------------------------