const express = require("express");
const jwt = require("jsonwebtoken");

const AccountDB = require("./accountSchema.js");
const CardDB = require("./cardSchema.js");
const DynamicCard = require("./dynamicCardSchema.js")

const router = express.Router();







let isUser = false;
let reqEmail = "";

const getEmail = (req, res)=>{
	const reqCookie = req.cookies.signature;

	if(reqCookie){
		jwt.verify(reqCookie, "ourBigSecret", (error, correctCookie)=>{
			if(correctCookie){
				isUser = true;
				reqEmail = correctCookie.email;
			}else{
				res.redirect("/login");
			}
		})
	}else{
		res.redirect("/login");
	}
}





router.get("/data_price", async(req, res)=>{

	getEmail(req, res);


	if(isUser === true){
		let thisAccount = await AccountDB.findOne({email: reqEmail});


		if(thisAccount){

			if(thisAccount.time < 2){
				await AccountDB.findOneAndUpdate({email: reqEmail}, {time: thisAccount.time+1}, {new: true});
			}
			
			if(thisAccount.time > 1){
				isUser = "old user";
			}
			
			res.render("dataPrice.ejs", {fullName: thisAccount.fullName, email: thisAccount.email, isUser, purchase: thisAccount.purchase, reward:thisAccount.reward, wallet: thisAccount.wallet});
		}else{
			res.redirect("/login");
		}	
	}

	
});










router.get("/recharge_price", async(req, res)=>{

	getEmail(req, res);


		if(isUser === true){
			let thisAccount = await AccountDB.findOne({email: reqEmail});


		if(thisAccount){

			if(thisAccount.time < 2){
				await AccountDB.findOneAndUpdate({email: reqEmail}, {time: thisAccount.time+1}, {new: true});
			}
			
			if(thisAccount.time > 1){
				isUser = "old user";
			}
			
			res.render("rechargePrice.ejs", {email: thisAccount.email, fullName: thisAccount.fullName, isUser, purchase: thisAccount.purchase, reward:thisAccount.reward, wallet: thisAccount.wallet});
		}else{
			res.redirect("/login");
		}		
	}

	
});





















router.post("/send_data...", async(req, res)=>{

	

	try{
		const thisAccount = await AccountDB.findOne({email: req.body.email});

		if(thisAccount.wallet >= parseInt(req.body.amount)){
			await AccountDB.findOneAndUpdate({email: req.body.email}, {"wallet": thisAccount.wallet - parseInt(req.body.amount)});
		
			res.json({wallet: thisAccount.wallet - parseInt(req.body.amount)});
		}else{
			res.json({low: "low", amount: thisAccount.wallet});
		}

		
	}catch(error){
		res.json({error: error.message});
	}

});







router.get("/data_type", async(req, res)=>{

	getEmail(req, res);

	if(isUser === true){

		let thisAccount = await AccountDB.findOne({email: reqEmail});


		if(thisAccount){

			
			res.render("dataType.ejs", {fullName: thisAccount.fullName, email: thisAccount.email, isUser, purchase: thisAccount.purchase, reward:thisAccount.reward, wallet: thisAccount.wallet});
		}else{
			res.redirect("/login");
		}		
	}

	
});








module.exports = router;