# messageio
Code name Message.io. University project. Dweet.io clone.

## Prerequisites
[Install Redis](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-redis)  
[Install MongoDB](http://docs.mongodb.org/manual/installation/)  
[Install NodeJS](http://howtonode.org/how-to-install-nodejs)  

## Extras
Install [frisby.js](http://frisbyjs.com/) if you intend to run tests  
Install [apidoc.js](http://apidocjs.com/) if you intend to generate documentation

## Running the project  
Assuming you have an instance of MongoDB and Redis, both running on default ports:  
`clone` the project  
`cd` into the root directory  
`npm install`  
`node app.js`  

If all goes well, you should see this...  
```
MongoDB connected  
Connecting to Redis  
Redis Connected  
Connected to Redis DB 7  
Mounting API  
API v1 Mounted  
App listening on port 3000  
```  

## Trying it out  
### Pinging the server
```
curl http://localhost:3000/api/v1/
```

The above curl command would result in the response:
```
{
    "this": "succeeded",
    "in": "pinging the server"
}
```

### Creating a device
```
curl http://localhost:3000/api/v1/create -d "name=my-new-devcie&description=shiny+new+device"
```

The above curl command would result in the response:  
```
{
    "this": "succeeded",
    "in": "creating the device",
    "with": {
        "name": "my-new-device",
        "description": "shiny new device"
    }
}
```
