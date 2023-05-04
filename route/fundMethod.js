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





router.get("/fund_method", async(req, res)=>{

	getEmail(req, res);

	let thisAccount = await AccountDB.findOne({email: reqEmail});


	if(thisAccount){

		if(thisAccount.time < 2){
			await AccountDB.findOneAndUpdate({email: reqEmail}, {time: thisAccount.time+1}, {new: true});
		}
		
		if(thisAccount.time > 1){
			isUser = "old user";
		}
		
		res.render("fundMethod.ejs", {isUser, wallet: thisAccount.wallet, purchase: thisAccount.purchase, reward:thisAccount.reward});
	}else{
		res.redirect("/login");
	}


	
});






module.exports = router;