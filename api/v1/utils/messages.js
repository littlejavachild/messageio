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
function get400NameAlreadyExistsError(_in,name){
	var reply = {
		"error" : "NameAlreadyExistsError",
		"this" : "failed",
		"in" : _in,
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
function get200DeviceLocked(_in,name){
	var reply = {
		"this" : "succeeded",
		"in" : _in,
		"with" : {
			"name" : name
		}
	}
	return reply;
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
function get400InvalidKeyError(_in){
	var reply = {
		"error" : "InvalidKeyError",
		"this" : "failed",
		"in" : _in,
		"because" : "the key is invalid"
	}
	var err = new Error("InvalidKeyError");
	err.status = 400;
	err.json = reply;
	return err;
}
//--------------------------------------------------------------------------------------------------
function get200DeviceUnlocked(_in,name){
	var reply = {
		"this" : "succeeded",
		"in" : _in,
		"with" : {
			"name" : name
		}
	}
	return reply;
}
//--------------------------------------------------------------------------------------------------
function get400DeviceLockedError(_in,name){
	var reply = {
		"error" : "DeviceLockedError",
		"this" : "failed",
		"in" : _in,
		"because" : "the device " + name + " is locked"
	}
	var err = new Error("DeviceLockedError");
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
exports.get500InternalServerError = get500InternalServerError;
exports.get400InvalidDeviceNameError = get400InvalidDeviceNameError;
exports.get400NameAlreadyExistsError = get400NameAlreadyExistsError;
exports.get400InvalidDescriptionError = get400InvalidDescriptionError;
exports.get200DeviceCreated = get200DeviceCreated;
exports.get400NoSuchDeviceError = get400NoSuchDeviceError;
exports.get400InvalidKeyError = get400InvalidKeyError;
exports.get400DeviceLockedError = get400DeviceLockedError;
exports.get200DeviceLocked = get200DeviceLocked;
exports.get204DeviceSuccessfullyDeleted = get204DeviceSuccessfullyDeleted;
exports.get200DeviceUnlocked = get200DeviceUnlocked;