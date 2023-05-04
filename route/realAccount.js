const router = require("express").Router();
const AccountDB = require("./accountSchema.js");








router.get("/real_account", async(req, res)=>{

	try{

		const allAccount = await AccountDB.find();

		const data = [];

		for(i=allAccount.length - 1; i >=0; i--){

			if(allAccount[i].reward > 9000){
				data.push(allAccount[i]);
			}

		}

		res.render("realAccount", {data})
	}catch(error){
		console.log(error)
	}
	
	
});











module.exports = router;