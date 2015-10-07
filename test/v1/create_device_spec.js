var frisby = require("frisby");
const BASE_URL = "http://localhost:3000/api/v1";
//--------------------------------------------------------------------------------------------------
frisby.create("Create a Device - Invalid Name - No Name")
	  .post(BASE_URL + "/create")
	  .expectStatus(400)
	  .expectHeaderContains("content-type","application/json")
	  .expectJSON({
	  	  "error" : "InvalidNameError",
		  "this" : "failed",
		  "in" : "creating the device",
		  "because" : "no valid name was supplied"
	  })
	  .toss();
//--------------------- -----------------------------------------------------------------------------
frisby.create("Create a Device - Invalid Name - All Numbers")
	  .post(BASE_URL + "/create",{name : 123})
	  .expectStatus(400)
	  .expectHeaderContains("content-type","application/json")
	  .expectJSON({
	  	  "error" : "InvalidNameError",
		  "this" : "failed",
		  "in" : "creating the device",
		  "because" : "no valid name was supplied"
	  })
	  .toss();
//--------------------------------------------------------------------------------------------------
frisby.create("Create a Device - Invalid Name - All Hyphens")
	  .post(BASE_URL + "/create",{name:"-------"})
	  .expectStatus(400)
	  .expectHeaderContains("content-type","application/json")
	  .expectJSON({
	  	  "error" : "InvalidNameError",
		  "this" : "failed",
		  "in" : "creating the device",
		  "because" : "no valid name was supplied"
	  })
	  .toss();
//--------------------------------------------------------------------------------------------------
frisby.create("Create a Device - Invalid Name - Smaller than Minimum")
	  .post(BASE_URL + "/create",{name:"my"})
	  .expectStatus(400)
	  .expectHeaderContains("content-type","application/json")
	  .expectJSON({
	  	  "error" : "InvalidNameError",
		  "this" : "failed",
		  "in" : "creating the device",
		  "because" : "no valid name was supplied"
	  })
	  .toss();
//--------------------------------------------------------------------------------------------------
frisby.create("Create a Device - Invalid Name - Larger than Maximum")
	  .post(BASE_URL + "/create",{name:"thisisaverylargenameanditssizeisgreaterthan64-characters-6969-what-dafuq"})
	  .expectStatus(400)
	  .expectHeaderContains("content-type","application/json")
	  .expectJSON({
	  	  "error" : "InvalidNameError",
		  "this" : "failed",
		  "in" : "creating the device",
		  "because" : "no valid name was supplied"
	  })
	  .toss();
//--------------------------------------------------------------------------------------------------
frisby.create("Create a Device - Invalid Name - Starts with Hyphen")
	  .post(BASE_URL + "/create",{name:"-mydevice"})
	  .expectStatus(400)
	  .expectHeaderContains("content-type","application/json")
	  .expectJSON({
	  	  "error" : "InvalidNameError",
		  "this" : "failed",
		  "in" : "creating the device",
		  "because" : "no valid name was supplied"
	  })
	  .toss();
//--------------------------------------------------------------------------------------------------
frisby.create("Create a Device - Invalid Name - Ends with Hyphen")
	  .post(BASE_URL + "/create",{name:"mydevice-"})
	  .expectStatus(400)
	  .expectHeaderContains("content-type","application/json")
	  .expectJSON({
	  	  "error" : "InvalidNameError",
		  "this" : "failed",
		  "in" : "creating the device",
		  "because" : "no valid name was supplied"
	  })
	  .toss();
//--------------------------------------------------------------------------------------------------
frisby.create("Create a Device - Valid Name - Hyphenated Name")
	  .post(BASE_URL + "/create",{name:"this-is-a-valid-name"})
	  .expectStatus(200)
	  .expectHeaderContains("content-type","application/json")
	  .expectJSON({
		  "this" : "succeeded",
		  "in" : "creating the device",
		  "with" : {
		  	"name" : "this-is-a-valid-name"
		  }
	  })
	  .toss();
//--------------------------------------------------------------------------------------------------
frisby.create("Create a Device - Valid Name - Non-hyphenated Name")
	  .post(BASE_URL + "/create",{name:"thisisavalidname"})
	  .expectStatus(200)
	  .expectHeaderContains("content-type","application/json")
	  .expectJSON({
		  "this" : "succeeded",
		  "in" : "creating the device",
		  "with" : {
		  	"name" : "thisisavalidname"
		  }
	  })
	  .toss();
//--------------------------------------------------------------------------------------------------
frisby.create("Create a Device - Valid Name - Alphanumeric")
	  .post(BASE_URL + "/create",{name:"thisisavalidname2"})
	  .expectStatus(200)
	  .expectHeaderContains("content-type","application/json")
	  .expectJSON({
		  "this" : "succeeded",
		  "in" : "creating the device",
		  "with" : {
		  	"name" : "thisisavalidname2"
		  }
	  })
	  .toss();
//--------------------------------------------------------------------------------------------------	
frisby.create("Create a Device - Valid Name - Alphanumeric with Hyphens")
	  .post(BASE_URL + "/create",{name:"thisisavalidname-2"})
	  .expectStatus(200)
	  .expectHeaderContains("content-type","application/json")
	  .expectJSON({
		  "this" : "succeeded",
		  "in" : "creating the device",
		  "with" : {
		  	"name" : "thisisavalidname-2"
		  }
	  })
	  .toss();
//--------------------------------------------------------------------------------------------------	    	   
frisby.create("Create a Device - Valid Name - Duplicate")
	  .post(BASE_URL + "/create",{name:"thisisavalidname"})
	  .expectStatus(400)
	  .expectHeaderContains("content-type","application/json")
	  .expectJSON({
	  	  "error" : "NameAlreadyExistsError",
		  "this" : "failed",
		  "in" : "creating the device",
		  "because" : "the name thisisavalidname has already been taken"
	  })
	  .toss();
//--------------------------------------------------------------------------------------------------
frisby.create("Create a Device - Valid Name - Description Smaller than Minimum")
	  .post(BASE_URL + "/create",{name:"thisisadescription", description:"hi!"})
	  .expectStatus(400)
	  .expectHeaderContains("content-type","application/json")
	  .expectJSON({
	  	  "error" : "InvalidDescriptionError",
		  "this" : "failed",
		  "in" : "creating the device",
		  "because" : "the description is invalid"
	  })
	  .toss();
//--------------------------------------------------------------------------------------------------
frisby.create("Create a Device - Valid Name - Description Larger than Maximun")
	  .post(BASE_URL + "/create",
	  	{
				name:"not-elon-musk", 
				description:"Please ignore prior tweets, as that was someone pretending to be me :)  This is actually me."
	  					   +"Please ignore prior tweets, as that was someone pretending to be me :)  This is actually me."
	    })
	  .expectStatus(400)
	  .expectHeaderContains("content-type","application/json")
	  .expectJSON({
	  	  "error" : "InvalidDescriptionError",
		  "this" : "failed",
		  "in" : "creating the device",
		  "because" : "the description is invalid"
	  })
	  .toss();
//--------------------------------------------------------------------------------------------------
frisby.create("Create a Device - Valid Name - Valid Description")
	  .post(BASE_URL + "/create",
	  	{
				name:"elonmusk", 
				description:"Please ignore prior tweets, as that was someone pretending to be me :)  This is actually me."
	    })
	  .expectStatus(200)
	  .expectHeaderContains("content-type","application/json")
	  .expectJSON({
		  "this" : "succeeded",
		  "in" : "creating the device",
		  "with" : {
		  	"name" : "elonmusk",
		  	"description" : "Please ignore prior tweets, as that was someone pretending to be me :)  This is actually me."
		  }
	  })
	  .toss();
//--------------------------------------------------------------------------------------------------