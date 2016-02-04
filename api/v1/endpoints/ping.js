function ping(req,res,next){
	return res.json({"this" : "succeeded", "in" : "pinging the server"});
}

module.exports = ping;