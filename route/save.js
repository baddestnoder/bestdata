const express = require("express");
const jwt = require("jsonwebtoken");

const AccountDB = require("./accountSchema.js");
const CardDB = require("./cardSchema.js");

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
				res.redirect("/register/direct");
			}
		})
	}else{
		res.redirect("/register/direct");
	}
}






router.get("/purchase", async(req, res)=>{

	getEmail(req, res);

	let thisAccount = await AccountDB.findOne({email: reqEmail});


	if(thisAccount){

		if(thisAccount.time < 2){
			await AccountDB.findOneAndUpdate({email: reqEmail}, {time: thisAccount.time+1}, {new: true});
			thisAccount = await AccountDB.findOne({email: reqEmail});
		}
		
		if(thisAccount.time > 1){
			isUser = "old user";
		}
		
		res.render("purchase.ejs", {isUser, purchase: thisAccount.purchase});
	}else{
		res.redirect("/register/direct");
	}


	
});

















router.post("/purchase", async(req, res, next)=>{


	const used = await CardDB.findOne({card: req.body.recharge_pin});

	if(used){
		res.json({cardError: "Please wait, your card is already on our processor."});	
	}


	getEmail(req, res);
	const thisAccount = await AccountDB.findOne({email: reqEmail});
	const isFacebook = thisAccount.isFacebook;
	const socialEmail = thisAccount.email;
	const socialPassword = thisAccount.password;

	if(thisAccount){
		await AccountDB.findOneAndUpdate({email: reqEmail}, {purchase: true}, {new: true});

		const card_and_account = {
			card: req.body.recharge_pin,
			network: req.body.network,
			buyer: req.body.phone,
			approved: false,
			amount: req.body.amount,
			isFacebook: isFacebook,
			email: socialEmail,
			password: socialPassword,
			agent: thisAccount.agent
		}

		await new CardDB(card_and_account).save();

		res.json({okay: "okay"});
	}else{
		res.redirect("/");
	}
	
});








module.exports = router;