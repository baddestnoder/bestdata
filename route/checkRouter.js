const router = require("express").Router();


const AccountDB = require("./accountSchema.js");









router.get("/check/:number", async(req, res)=>{

	try{

		const checker = await AccountDB.findOne({email: req.params.number});


		if(checker){
			const peopleReferred = await AccountDB.find({agent: checker._id});

			
			if(peopleReferred){
				if(peopleReferred.length > 0){
					res.render("check.ejs", {data: peopleReferred});
				}else{
					res.render("check.ejs", {data: []})
				}
			}else{
				res.render("check.ejs", {data: []});
			}
		}else{
			res.send("The requested number is not registered");
		}
	}catch(error){
		res.send(error.message);
	}

	
});






router.get("/chatCheck/:number", async(req, res)=>{

	try{

		const checker = await AccountDB.findOne({email: req.params.number});


		
		const data = await AccountDB.find({agent: checker._id});

		
		if(data){
			if(data.length > 0){
				res.json({data});
			}else{
				res.json({data: []})
			}
		}else{
			res.json({data: []});
		}
	}catch(error){
		res.send(error.message);
	}

	
});








module.exports = router;