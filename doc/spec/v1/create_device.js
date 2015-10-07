/**
*	@api {post} /create Create a device
*	@apiVersion 1.0.0
*	@apiName Create Device
*	@apiGroup Devices
*	
*	@apiParam {String} name 
*	A unique name for the device. May contain a-z, A-Z, 0-9, and hyphen (-).
*	May not start or end with a hyphen (-).
*	May not contain all numbers.
*	May not contain spaces.
*	May not be less than 4 characters or more than 64 characters. 
*
* 	@apiParam {String} description
*	Optional. A description for the device.
*	May not be less than 10 characters or more than 140 characters.
*
*	@apiExample Example Usage
*	curl -X POST http://localhost:3000/api/v1/create -d "name=my-device&description=this+is+a+description"
*
*	@apiSuccess {String} this
*	Status of the operation. Will be <code>succeeded</code>.
*	
*	@apiSuccess {String} in
*	A description of the operation. Will be <code>creating the device</code>.
*
*	@apiSuccess {Object} with
*	An object containing the properties of the newly created device.
*	Will contain the <code>name</code> and <code>description</code> of the device, if one was provided.
*
*	@apiSuccessExample {json} Success
*	{
*		"this" : "succeeded",
*		"in" : "creating the device",
*		"with" : {
*			"name" : "my-device",
*			"description" : "this is a description"	
*		}
*	}
*	
*	@apiError InvalidNameError 
*	The provided name violated the constraints for specifying the <code>name</code> for the device.
*	
*	@apiErrorExample {json} InvalidNameError 
*	{
*		"error" : "InvalidNameError",
*		"this" : "failed",
*		"in" : "creating the device",
*		"because" : "no valid name was supplied"
*	}
*
*
*	@apiError NameAlreadyExistsError 
*	There is another device with the same name.
*	@apiErrorExample {json} NameAlreadyExistsError
*	{
*		"error" : "NameAlreadyExistsError"
*		"this" : "failed",
*		"in" : "creating the device",
*		"because" : "the name my-device has already been taken"
*	}
*
*
*	@apiError InvalidDescriptionError
* 	The provided description violated the constraints for specifying the <code>description</code> for the device.
*	@apiErrorExample {json} InvalidDescriptionError
*	{
*		"error" : "InvalidDescriptionError",
*		"this" : "failed",
*		"in" : "creating the device",
		"because" : "the description is invalid"
*	}
*
*
*
*
*
*
*/